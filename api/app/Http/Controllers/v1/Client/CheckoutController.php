<?php

namespace App\Http\Controllers\v1\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\orders;
use App\Models\order_items;
use App\Models\product_variants; // <--- QUAN TRỌNG: Thêm model biến thể
use App\Services\VnpayService;
use App\Http\Requests\CheckoutRequest;
use Exception;
use App\Services\MomoService as momoService;
use App\Models\Coupon;
use Carbon\Carbon;

class CheckoutController extends Controller
{
    protected $vnpayService;
    protected $momoService;

    public function __construct(VnpayService $vnpayService, momoService $momoService)
    {
        $this->vnpayService = $vnpayService;
        $this->momoService = $momoService;
    }

    public function checkout(CheckoutRequest $request)
    {
        $data = $request->validated();

        // Bắt đầu Transaction: Nếu có lỗi (hết hàng, lỗi DB...) thì rollback toàn bộ
        DB::beginTransaction();
        try {
            $totalAmount = 0;
            $discountAmount = 0;
            $shippingFee = 0;

            // Tính tổng tiền (Loop 1)
            foreach ($data['cart_items'] as $item) {
                $totalAmount += $item['unit_price'] * $item['quantity'];
            }

            $grandTotal = $totalAmount - $discountAmount + $shippingFee;

            // 1. Tạo đơn hàng (Order Header)
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

            // 2. Tạo chi tiết đơn hàng (Order Items) & TRỪ TỒN KHO
            foreach ($data['cart_items'] as $item) {

                // --- [LOGIC MỚI] BẮT ĐẦU ---

                // Tìm biến thể sản phẩm và khóa dòng này lại (lockForUpdate)
                // để tránh 2 người cùng mua 1 cái áo cuối cùng cùng lúc
                $variant = product_variants::lockForUpdate()->find($item['variant_id']);

                if (!$variant) {
                    throw new Exception("Sản phẩm (ID: {$item['variant_id']}) không tồn tại.");
                }

                // Kiểm tra số lượng tồn kho
                if ($variant->stock_quantity < $item['quantity']) {
                    throw new Exception("Sản phẩm '{$variant->sku}' không đủ hàng. (Còn: {$variant->stock_quantity}, Bạn đặt: {$item['quantity']})");
                }

                // Trừ kho
                $variant->decrement('stock_quantity', $item['quantity']);

                // --- [LOGIC MỚI] KẾT THÚC ---

                // Tạo record trong bảng order_items
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

            // 3. Xử lý thanh toán (Giữ nguyên logic cũ của bạn)
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
            if ($data['payment_method'] === 'momo') {
                $paymentUrl = $this->momoService->createPayment([
                    'order_code' => $order->order_code,
                    'amount' => $order->grand_total
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Đơn hàng được tạo thành công. Hãy chuyển hướng đến Momo và thanh toán.',
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
            DB::rollBack(); // Hoàn tác mọi thứ nếu có lỗi (kể cả trừ kho)
            return response()->json([
                'success' => false,
                'message' => 'Lỗi đặt hàng: ' . $e->getMessage() // Trả về thông báo lỗi cụ thể (ví dụ: Không đủ hàng)
            ], 500);
        }
    }
}
