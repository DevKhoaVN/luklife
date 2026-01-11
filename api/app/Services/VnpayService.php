<?php

namespace App\Services;

use Exception;

class VnpayService
{
    /**
     * Tạo URL chuyển hướng sang VNPAY
     */
    public function createPaymentUrl($data)
    {
        // $data bao gồm: order_code, amount
        $vnp_TmnCode = config('vnpay.tmn_code');
        $vnp_HashSecret = config('vnpay.hash_secret');
        $vnp_Url = config('vnpay.url');
        $vnp_Returnurl = config('vnpay.return_url');
        $vnp_TxnRef = $data['order_code'];
        $vnp_OrderInfo = "Thanh toan don hang " . $vnp_TxnRef;
        $vnp_OrderType = "billpayment";
        $vnp_Amount = $data['amount'] * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = request()->ip();
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_ExpireDate" => date('YmdHis', strtotime('+15 minutes')),
        );
        // Sắp xếp mảng theo thứ tự a-z (Bắt buộc)
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //  
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        return $vnp_Url;
    }

    /**
     * Kiểm tra chữ ký khi VNPAY trả về (IPN/Return)
     */
    public function checkReturn($data)
    {
        $vnp_HashSecret = config('vnpay.hash_secret');
        $vnp_SecureHash = $data['vnp_SecureHash'] ?? '';

        // Loại bỏ secureHash khỏi dữ liệu để tính toán lại
        $inputData = array();
        foreach ($data as $key => $value) {
            if (substr($key, 0, 4) == "vnp_" && $key != "vnp_SecureHash") {
                $inputData[$key] = $value;
            }
        }

        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        // So sánh chữ ký mình tính vs chữ ký VNPAY gửi về
        if ($secureHash == $vnp_SecureHash) {
            return [
                'success' => true,
                'order_code' => $inputData['vnp_TxnRef'],
                'amount' => $inputData['vnp_Amount'] / 100,
                'response_code' => $inputData['vnp_ResponseCode'] // 00 là thành công
            ];
        } else {
            return ['success' => false, 'message' => 'Chữ ký không hợp lệ'];
        }
    }
}
