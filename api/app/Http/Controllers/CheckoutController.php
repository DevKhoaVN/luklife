<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\Discounts;
use App\Services\VNPayService;
use App\Http\Requests\CheckoutRequest;
use App\Models\Discount;
use Exception;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckoutController extends Controller
{
    protected $vnpayService;

    public function __construct(VNPayService $vnpayService)
    {
        $this->vnpayService = $vnpayService;
    }

    /**
     * Checkout và tạo đơn hàng
     */
    public function checkout(CheckoutRequest $request)
    {
      
        $data = $request->validated();

             DB::beginTransaction();
        try {
            $totalAmount = 0;
            $discountAmount = 0;
            $discountId = null;
            $discountCode = null;
            $shippingFee = 30000; // Phí vận chuyển cố định 30k

            // Tính tổng tiền hàng
            foreach ($data['cart_items'] as $item) {
                $totalAmount += $item['unit_price'] * $item['quantity'];
            }

            // ✅ XỬ LÝ DISCOUNT (nếu có)
            if (isset($data['discount_code']) && $data['discount_code']) {
                $discount = Discount::where('code', $data['discount_code'])
                    ->where('is_active', true)
                    ->first();

                if ($discount && $discount->is_active()) {
                    // Kiểm tra giá trị đơn hàng tối thiểu
                    if ($totalAmount >= $discount->min_order_value) {
                        $discountId = $discount->id;
                        $discountCode = $discount->code;

                        // Tính discount amount
                        if ($discount->type === 'percentage') {
                            $discountAmount = ($totalAmount * $discount->value) / 100;

                            // Giới hạn discount tối đa
                            if ($discount->max_discount_value && $discountAmount > $discount->max_discount_value) {
                                $discountAmount = $discount->max_discount_value;
                            }
                        } elseif ($discount->type === 'fixed') {
                            $discountAmount = min($discount->value, $totalAmount);
                        } elseif ($discount->type === 'free_shipping') {
                            $shippingFee = 0;
                        }
                    }
                }
            }

            $grandTotal = $totalAmount - $discountAmount + $shippingFee;

            // ✅ TẠO ĐƠN HÀNG
            $order = Orders::create([
                'order_code' => 'ORD' . time() . rand(100, 999),
                'user_id' => JWTAuth::parseToken()->authenticate()->id ??  null,
                'recipient_name' => $data['recipient_name'],
                'recipient_phone' => $data['recipient_phone'],
                'shipping_address' => $data['shipping_address'],
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'shipping_fee' => $shippingFee,
                'grand_total' => $grandTotal,
                'payment_method' => $data['payment_method'],
                'payment_status' => 'unpaid',
                'order_status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            // ✅ TẠO CHI TIẾT ĐƠN HÀNG
            foreach ($data['cart_items'] as $item) {
                OrderItems::create([
                    'order_id' => $order->id,
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'item_discount' => 0,
                    'sub_total' => $item['unit_price'] * $item['quantity'],
                ]);
            }

            DB::commit();

            // ✅ XỬ LÝ THANH TOÁN
            if ($data['payment_method'] === 'vnpay') {
                try {
                    $ipAddress = $request->ip();
                    $paymentUrl = $this->vnpayService->createPaymentUrl($order, $ipAddress);

          
                    return response()->json([
                        'success' => true,
                        'message' => 'Đơn hàng được tạo thành công. Chuyển hướng đến VNPay để thanh toán.',
                        'data' => [
                            'payment_url' => $paymentUrl,
                            'order_code' => $order->order_code,
                            'order_id' => $order->id,
                            'grand_total' => $order->grand_total,
                        ]
                    ], 200);
                } catch (Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Lỗi tạo link thanh toán: ' . $e->getMessage(),
                        'order_code' => $order->order_code,
                    ], 500);
                }
            }

            // COD - Thanh toán khi nhận hàng
            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công. Bạn sẽ thanh toán khi nhận hàng.',
                'data' => [
                    'order_code' => $order->order_code,
                    'order_id' => $order->id,
                    'grand_total' => $order->grand_total,
                ]
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Checkout error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Callback từ VNPay
     */
    public function vnpayCallback(Request $request)
    {
        $result = $this->vnpayService->handleCallback($request);

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5317');

        if ($result['success']) {
            return redirect()->to(
                $frontendUrl . '/checkout/payment-success?' . http_build_query([
                    'order_code' => $result['order']->order_code,
                    'status' => 'success',
                    'amount' => $result['order']->grand_total,
                ])
            );
        } else {
            return redirect()->to(
                $frontendUrl . '/checkout/payment-failed?' . http_build_query([
                    'order_code' => $result['order']->order_code ?? '',
                    'status' => 'failed',
                    'message' => $result['message'],
                ])
            );
        }
    }

    /**
     * IPN từ VNPay (Server-to-Server)
     */
    public function vnpayIPN(Request $request)
    {
        $result = $this->vnpayService->handleCallback($request);

        return response()->json([
            'RspCode' => $result['RspCode'],
            'Message' => $result['message'],
        ]);
    }
}
