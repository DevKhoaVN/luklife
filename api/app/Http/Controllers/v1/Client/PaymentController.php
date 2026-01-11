<?php

namespace App\Http\Controllers\v1\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VnpayService;
use App\Models\orders as Order;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $vnpayService;

    public function __construct(VnpayService $vnpayService)
    {
        $this->vnpayService = $vnpayService;
    }

    // 1. API Tạo Link Thanh Toán
    public function createPaymentUrl(Request $request)
    {
        $request->validate([
            'order_code' => 'required|exists:orders,order_code'
        ]);

        $order = Order::where('order_code', $request->order_code)->first();

        // Kiểm tra xem đơn đã trả tiền chưa
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng này đã được thanh toán rồi!'
            ], 400);
        }

        // Gọi Service để tạo URL
        $data = [
            'order_code' => $order->order_code,
            'amount' => $order->grand_total, // Số tiền cần thanh toán
        ];

        $paymentUrl = $this->vnpayService->createPaymentUrl($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo link thanh toán thành công',
            'payment_url' => $paymentUrl,

        ]);
    }

    // 2. API Xử lý kết quả trả về từ VNPAY
    // Method: GET (VNPAY sẽ redirect về đây)
    public function vnpayReturn(Request $request)
    {
        // 1. Kiểm tra dữ liệu VNPAY gửi về có hợp lệ không (Check chữ ký)
        $result = $this->vnpayService->checkReturn($request->all());

        if ($result['success']) {
            // Chữ ký hợp lệ -> Lấy thông tin đơn hàng
            $orderCode = $result['order_code'];
            $order = Order::where('order_code', $orderCode)->first();

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng']);
            }

            // 2. Kiểm tra kết quả giao dịch (00 là thành công)
            if ($result['response_code'] == '00') {
                // UPDATE TRẠNG THÁI ĐƠN HÀNG -> PAID
                $order->payment_status = 'paid';
                $order->save();

                // Ở môi trường thực tế, bạn sẽ redirect về trang "Cảm ơn" của Frontend
                // return redirect('https://frontend-cua-ban.com/checkout/success');

                return response()->json([
                    'success' => true,
                    'message' => 'Thanh toán thành công!',
                    'data' => $order
                ]);
            } else {
                // Giao dịch thất bại (Khách hủy, hoặc thẻ lỗi)
                $order->payment_status = 'failed';
                $order->save();

                return response()->json([
                    'success' => false,
                    'message' => 'Thanh toán thất bại hoặc bị hủy.'
                ]);
            }
        } else {
            // Chữ ký không khớp (Có thể do hacker giả mạo dữ liệu)
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ (Sai chữ ký).'
            ], 400);
        }
    }
}
