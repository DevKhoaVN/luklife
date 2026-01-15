<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller {
    public function createPayment(Request $request){
        $orderId   = time() . "";               // mã đơn hàng duy nhất
        $amount    = $request->amount * 100;    // VNPAY nhân 100 (ví dụ 100.000 VNĐ → 10000000)
        $orderInfo = "Thanh toan don hang #$orderId";
        $locale    = 'vn';

        $vnp_Url = config('vnpay.base_url');
        $vnp_Returnurl = config('vnpay.return_url');

        $inputData = [
            "vnp_Version"    => "2.1.0",
            "vnp_TmnCode"    => config('vnpay.tmn_code'),
            "vnp_Amount"     => $amount,
            "vnp_Command"    => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode"   => "VND",
            "vnp_IpAddr"     => $request->ip(),
            "vnp_Locale"     => $locale,
            "vnp_OrderInfo"  => $orderInfo,
            "vnp_OrderType"  => "other",
            "vnp_ReturnUrl"  => $vnp_Returnurl,
            "vnp_TxnRef"     => $orderId,
        ];

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, config('vnpay.hash_secret')); //
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        // Chuyển hướng người dùng sang VNPAY
        return redirect($vnp_Url);
    }
}