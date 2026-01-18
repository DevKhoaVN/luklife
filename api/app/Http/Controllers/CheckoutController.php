<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\ProductVariant;
use App\Services\VNPayService;
use App\Http\Requests\CheckoutRequest;
use App\Models\Discount;
use Exception;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Services\DiscountService;

class CheckoutController extends Controller
{
    protected $vnpayService;
    protected $discountService;

    public function __construct(
        VNPayService $vnpayService,
        DiscountService $discountService
    ) {
        $this->vnpayService = $vnpayService;
        $this->discountService = $discountService;
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
            $shippingFee = 30000; // Phí ship cứng (có thể nâng cấp sau)

            // 1. Tính tổng tiền hàng (Tạm tính)
            foreach ($data['cart_items'] as $item) {
                $totalAmount += $item['unit_price'] * $item['quantity'];
            }

            // 2. XỬ LÝ MÃ GIẢM GIÁ (Dùng Service chuẩn thay vì viết if/else dài dòng)
            if (!empty($data['discount_code'])) {
                // Gọi sang DiscountService để kiểm tra hạn, số lượng, v.v.
                $couponResult = $this->discountService->applyCoupon($data['discount_code'], $totalAmount);

                $discountAmount = $couponResult['discount_amount'];
                $discountId     = $couponResult['discount_id'];

                // Tăng số lần sử dụng mã (Quan trọng!)
                if (isset($couponResult['coupon_obj'])) {
                    $couponResult['coupon_obj']->increment('used_count');
                }
            }

            // Tính tổng cuối cùng
            $grandTotal = $totalAmount - $discountAmount + $shippingFee;
            if ($grandTotal < 0) $grandTotal = 0;

            // 3. TẠO ĐƠN HÀNG (ORDER HEADER)
            // Lấy User ID an toàn hơn
            $user = null;
            try {
                if ($token = JWTAuth::getToken()) {
                    $user = JWTAuth::parseToken()->authenticate();
                }
            } catch (\Exception $e) {
                // Khách vãng lai, không làm gì cả
            }

            $order = Orders::create([
                'order_code'      => 'ORD' . time() . rand(100, 999),
                'user_id'         => $user ? $user->id : null,
                'recipient_name'  => $data['recipient_name'],
                'recipient_phone' => $data['recipient_phone'],
                'shipping_address' => $data['shipping_address'],
                'total_amount'    => $totalAmount,
                'discount_amount' => $discountAmount,
                'shipping_fee'    => $shippingFee,
                'grand_total'     => $grandTotal,
                'payment_method'  => $data['payment_method'],
                'payment_status'  => 'unpaid',
                'order_status'    => 'pending',
                'notes'           => $data['notes'] ?? null,
                // Lưu thêm ID coupon để sau này đối soát
                'coupon_id'       => $discountId,
            ]);

            // 4. TẠO CHI TIẾT & TRỪ TỒN KHO (Phần quan trọng nhất bị thiếu ở code cũ)
            foreach ($data['cart_items'] as $item) {
                // Lock để tránh tranh chấp kho
                $variant = ProductVariant::lockForUpdate()->find($item['variant_id']);

                if (!$variant) {
                    throw new Exception("Sản phẩm (ID: {$item['variant_id']}) không tồn tại.");
                }

                // Kiểm tra kho
                if ($variant->stock_quantity < $item['quantity']) {
                    throw new Exception("Sản phẩm SKU: {$variant->sku} không đủ hàng (Còn: {$variant->stock_quantity}).");
                }

                // Trừ kho
                $variant->decrement('stock_quantity', $item['quantity']);

                // Lưu chi tiết đơn
                OrderItems::create([
                    'order_id'      => $order->id,
                    'variant_id'    => $item['variant_id'],
                    'quantity'      => $item['quantity'],
                    'unit_price'    => $item['unit_price'],
                    'item_discount' => 0,
                    'sub_total'     => $item['unit_price'] * $item['quantity'],
                ]);
            }

            DB::commit();

            // 5. XỬ LÝ THANH TOÁN ONLINE (VNPAY)
            if ($data['payment_method'] === 'vnpay') {
                try {
                    $ipAddress = $request->ip();
                    // Đảm bảo hàm createPaymentUrl trong VNPayService nhận đúng tham số
                    $paymentUrl = $this->vnpayService->createPaymentUrl($order, $ipAddress);

                    return response()->json([
                        'success' => true,
                        'message' => 'Tạo link thanh toán VNPay thành công.',
                        'data' => [
                            'payment_url' => $paymentUrl,
                            'order_code'  => $order->order_code,
                            'order_id'    => $order->id,
                            'grand_total' => $order->grand_total,
                        ]
                    ], 200);
                } catch (Exception $e) {
                    // Nếu lỗi tạo link thì không rollback đơn hàng, chỉ báo lỗi
                    // Hoặc rollback tùy nghiệp vụ (ở đây tôi chọn giữ đơn hàng pending)
                    return response()->json([
                        'success' => false,
                        'message' => 'Lỗi tạo link thanh toán: ' . $e->getMessage(),
                        'order_code' => $order->order_code,
                    ], 500);
                }
            }

            // 6. THANH TOÁN COD
            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công. Thanh toán khi nhận hàng.',
                'data' => [
                    'order_code'  => $order->order_code,
                    'order_id'    => $order->id,
                    'grand_total' => $order->grand_total,
                ]
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Checkout error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() // Trả lỗi cụ thể (ví dụ: Hết hàng)
            ], 500); // Hoặc 400 Bad Request
        }
    }

    // --- CÁC HÀM CALLBACK GIỮ NGUYÊN TỪ CODE CỦA BẠN ---

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

    public function vnpayIPN(Request $request)
    {
        $result = $this->vnpayService->handleCallback($request);
        return response()->json([
            'RspCode' => $result['RspCode'],
            'Message' => $result['message'],
        ]);
    }
}
