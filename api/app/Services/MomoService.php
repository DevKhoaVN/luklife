<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class MomoService
{
    public function createPayment($data)
    {
        $endpoint = config('momo.endpoint');
        $partnerCode = config('momo.partner_code');
        $accessKey = config('momo.access_key');
        $secretKey = config('momo.secret_key');
        // Thông tin đơn hàng
        $orderId = $data['order_code']; // Mã đơn hàng (Bắt buộc duy nhất)
        // $amount = (string)$data['amount']; // Momo bắt buộc số tiền là String
        $amount = (string)(int)$data['amount'];
        $orderInfo = "Thanh toan don hang " . $orderId;
        $requestId = time() . ""; // ID định danh request
        $requestType = "captureWallet"; // Loại thanh toán: Quét mã QR
        $extraData = ""; // Lưu ý: Nếu không có, để chuỗi rỗng

        // URL redirect: Sau khi thanh toán xong, Momo chuyển hướng về đây
        // (Lưu ý: Localhost không nhận được IPN, nhưng Redirect thì vẫn chạy ok)
        $redirectUrl = "http://127.0.0.1:8000/api/v1/payment/momo-return";
        $ipnUrl = "http://127.0.0.1:8000/api/v1/payment/momo-ipn";

        // 1. TẠO CHỮ KÝ (SIGNATURE)
        // Quy tắc: key=value nối với nhau bằng dấu &, theo thứ tự a-z
        $rawHash = "accessKey=" . $accessKey .
            "&amount=" . $amount .
            "&extraData=" . $extraData .
            "&ipnUrl=" . $ipnUrl .
            "&orderId=" . $orderId .
            "&orderInfo=" . $orderInfo .
            "&partnerCode=" . $partnerCode .
            "&redirectUrl=" . $redirectUrl .
            "&requestId=" . $requestId .
            "&requestType=" . $requestType;

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        // 2. Chuẩn bị dữ liệu gửi đi (JSON)
        $requestData = [
            'partnerCode' => $partnerCode,
            'partnerName' => "Test Momo",
            'storeId' => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature,
            'accessKey' => $accessKey
        ];

        // 3. Gọi API sang Momo (Dùng HTTP Client của Laravel)
        $response = Http::post($endpoint, $requestData);
        $json = $response->json();

        // 4. Xử lý kết quả
        if (isset($json['payUrl'])) {
            return $json['payUrl']; // Link thanh toán
        }

        // Nếu lỗi thì ném ra Exception để Controller bắt
        throw new Exception("Lỗi tạo Momo: " . ($json['message'] ?? 'Unknown error'));
    }
}
