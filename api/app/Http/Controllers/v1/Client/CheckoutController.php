<?php

namespace App\Http\Controllers\v1\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\orders;
use App\Models\order_items;
use App\Services\VnpayService;
use App\Http\Requests\CheckoutRequest; // 👈 Nhớ import file Request vừa tạo
use Exception;

class CheckoutController extends Controller
{
    protected $vnpayService;

    public function __construct(VnpayService $vnpayService)
    {
        $this->vnpayService = $vnpayService;
    }

    public function checkout(CheckoutRequest $request)
    {
        $data = $request->validated();
        DB::beginTransaction();
        try {
            $totalAmount = 0;
            $discountAmount = 0;
            $shippingFee = 0;
            foreach ($data['cart_items'] as $item) {
                $totalAmount += $item['unit_price'] * $item['quantity'];
            }
            $grandTotal = $totalAmount - $discountAmount + $shippingFee;
            //Tạo đơn
            $order = orders::create([
                'order_code' => 'ORD' . time() . rand(100, 999),
                'user_id' => $request->user() ? $request->user()->id : null,
                'recipient_name' => $data['recipient_name'],
                'recipient_phone' => $data['recipient_phone'],
                'shipping_address' => $data['shipping_address'],
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'shipping_fee' => $shippingFee,
                'grand_total' => $grandTotal,
                'payment_method' => $data['payment_method'],
                'payment_status' => 'unpaid',
                'order_status' => 'pending'
            ]);
            //Tạo chi tiết đơn
            foreach ($data['cart_items'] as $item) {
                order_items::create([
                    'order_id' => $order->id,
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'item_discount' => 0,
                    'sub_total' => $item['unit_price'] * $item['quantity'],
                ]);
            }
            DB::commit();
            if ($data['payment_method'] === 'vnpay') {
                $paymentUrl = $this->vnpayService->createPaymentUrl([
                    'order_code' => $order->order_code,
                    'amount' => $order->grand_total
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Đơn hàng được tạo thành công. Hãy chuyển hướng đến VNPAY và thanh toán.',
                    'payment_url' => $paymentUrl,
                    'order_code' => $order->order_code
                ]);
            }
            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công.',
                'order_code' => $order->order_code
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống:' . $e->getMessage()
            ], 500);
        }
    }
}
