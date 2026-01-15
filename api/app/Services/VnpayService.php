<?php

namespace App\Services;

use App\Models\Orders;
use App\Models\Transactions;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class VNPayService
{
    protected $vnp_TmnCode;
    protected $vnp_HashSecret;
    protected $vnp_Url;
    protected $vnp_ReturnUrl;

    public function __construct()
    {
        $this->vnp_TmnCode = config('vnpay.tmn_code');
        $this->vnp_HashSecret = config('vnpay.hash_secret');
        $this->vnp_Url = config('vnpay.base_url');
        $this->vnp_ReturnUrl = config('vnpay.return_url');
    }

    /**
     * Tạo URL thanh toán VNPay
     */
    public function createPaymentUrl(Orders $order, $ipAddress = '127.0.0.1')
    {
        try {
            // Tạo mã giao dịch unique
            $vnp_TxnRef = $order->order_code . '_' . time();
            $vnp_OrderInfo = 'Thanh toan don hang ' . $order->order_code;
            $vnp_OrderType = 'billpayment';
            $vnp_Amount = $order->grand_total * 100; // VNPay yêu cầu nhân 100
            $vnp_Locale = 'vn';
            $vnp_IpAddr = $ipAddress;

            $inputData = [
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $this->vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $this->vnp_ReturnUrl,
                "vnp_TxnRef" => $vnp_TxnRef,
            ];

            // Sắp xếp dữ liệu theo key
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

            $vnp_Url = $this->vnp_Url . "?" . $query;

            if ($this->vnp_HashSecret) {
                $vnpSecureHash = hash_hmac('sha512', $hashdata, $this->vnp_HashSecret);
                $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
            }

            // Lưu thông tin vào orders
            $order->update([
                'vnpay_txn_ref' => $vnp_TxnRef,
                'payment_status' => 'pending',
            ]);

            // Tạo transaction record
            Transactions::create([
                'order_id' => $order->id,
                'transaction_code' => $vnp_TxnRef,
                'payment_method' => 'vnpay',
                'transaction_amount' => $order->grand_total,
                'status' => 'pending',
                'processor' => 'VNPay',
                'processor_response' => json_encode([
                    'request_data' => $inputData,
                    'payment_url' => $vnp_Url,
                ]),
            ]);

            Log::info('VNPay payment URL created', [
                'order_code' => $order->order_code,
                'txn_ref' => $vnp_TxnRef,
                'amount' => $order->grand_total,
            ]);

            return $vnp_Url;
        } catch (Exception $e) {
            Log::error('VNPay create payment URL error', [
                'error' => $e->getMessage(),
                'order_id' => $order->id,
            ]);
            throw $e;
        }
    }

    /**
     * ✅ Return URL - Redirect user về frontend (cho UI)
     */
    public function vnpayReturn(Request $request)
    {
        // Log để debug
        Log::info('VNPay Return URL called', [
            'params' => $request->all(),
        ]);

        // Không cần xử lý business logic ở đây
        // Chỉ redirect về frontend để hiển thị kết quả
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        $vnp_ResponseCode = $request->input('vnp_ResponseCode');
        $vnp_TxnRef = $request->input('vnp_TxnRef');

        if ($vnp_ResponseCode == '00') {
            // Thanh toán thành công
            return redirect()->to(
                $frontendUrl . '/checkout/payment-success?' . http_build_query([
                    'txn_ref' => $vnp_TxnRef,
                    'status' => 'success',
                ])
            );
        } else {
            // Thanh toán thất bại
            return redirect()->to(
                $frontendUrl . '/checkout/payment-failed?' . http_build_query([
                    'txn_ref' => $vnp_TxnRef,
                    'status' => 'failed',
                    'code' => $vnp_ResponseCode,
                ])
            );
        }
    }

    /**
     * Xử lý callback từ VNPay
     */
    public function handleCallback($request)
    {
        try {
            $vnp_SecureHash = $request->input('vnp_SecureHash');
            $inputData = $request->except('vnp_SecureHash', 'vnp_SecureHashType');

            // Sắp xếp dữ liệu để tạo hash
            ksort($inputData);
            $hashData = "";
            $i = 0;

            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashData .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
            }

            $secureHash = hash_hmac('sha512', $hashData, $this->vnp_HashSecret);

            // Verify secure hash
            if ($secureHash !== $vnp_SecureHash) {
                Log::warning('VNPay callback: Invalid secure hash', [
                    'txn_ref' => $request->input('vnp_TxnRef'),
                ]);

                return [
                    'success' => false,
                    'message' => 'Invalid signature',
                    'RspCode' => '97',
                ];
            }

            // Lấy thông tin từ VNPay
            $vnp_TxnRef = $request->input('vnp_TxnRef');
            $vnp_ResponseCode = $request->input('vnp_ResponseCode');
            $vnp_Amount = $request->input('vnp_Amount') / 100; // Chia 100 để về VNĐ
            $vnp_BankCode = $request->input('vnp_BankCode');
            $vnp_TransactionNo = $request->input('vnp_TransactionNo');
            $vnp_PayDate = $request->input('vnp_PayDate');

            // ✅ FIX: Tìm transaction (sửa lỗi tên model)
            $transaction = Transactions::where('transaction_code', $vnp_TxnRef)->first();

            if (!$transaction) {
                Log::error('VNPay callback: Transaction not found', [
                    'txn_ref' => $vnp_TxnRef,
                ]);

                return [
                    'success' => false,
                    'message' => 'Transaction not found',
                    'RspCode' => '01',
                ];
            }

            $order = $transaction->order;

            // Kiểm tra số tiền
            if ($transaction->transaction_amount != $vnp_Amount) {
                Log::warning('VNPay callback: Amount mismatch', [
                    'txn_ref' => $vnp_TxnRef,
                    'expected' => $transaction->transaction_amount,
                    'received' => $vnp_Amount,
                ]);
            }

            DB::beginTransaction();
            try {
                // Xử lý theo response code
                if ($vnp_ResponseCode == '00') {
                    // Thanh toán thành công
                    $transaction->update([
                        'status' => 'success',
                        'processor_response' => json_encode($inputData),
                        'processed_at' => Carbon::now(),
                    ]);

                    $order->update([
                        'payment_status' => 'paid',
                        'order_status' => 'confirmed',
                        'paid_at' => Carbon::createFromFormat('YmdHis', $vnp_PayDate),
                    ]);

                    // Cập nhật discount used_count nếu có
                    if ($order->discount_id) {
                        DB::table('discounts')
                            ->where('id', $order->discount_id)
                            ->increment('used_count');
                    }

                    Log::info('VNPay payment successful', [
                        'order_code' => $order->order_code,
                        'txn_ref' => $vnp_TxnRef,
                        'transaction_no' => $vnp_TransactionNo,
                        'amount' => $vnp_Amount,
                    ]);

                    DB::commit();

                    return [
                        'success' => true,
                        'message' => 'Payment successful',
                        'RspCode' => '00',
                        'order' => $order,
                    ];
                } else {
                    // Thanh toán thất bại
                    $transaction->update([
                        'status' => 'failed',
                        'processor_response' => json_encode($inputData),
                        'processed_at' => Carbon::now(),
                    ]);

                    $order->update([
                        'payment_status' => 'failed',
                        'order_status' => 'cancelled',
                    ]);

                    Log::warning('VNPay payment failed', [
                        'order_code' => $order->order_code,
                        'txn_ref' => $vnp_TxnRef,
                        'response_code' => $vnp_ResponseCode,
                        'message' => $this->getResponseMessage($vnp_ResponseCode),
                    ]);

                    DB::commit();

                    return [
                        'success' => false,
                        'message' => $this->getResponseMessage($vnp_ResponseCode),
                        'RspCode' => $vnp_ResponseCode,
                        'order' => $order,
                    ];
                }
            } catch (Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (Exception $e) {
            Log::error('VNPay callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'System error',
                'RspCode' => '99',
            ];
        }
    }

    /**
     * Lấy message theo response code
     */
    protected function getResponseMessage($responseCode)
    {
        $messages = [
            '00' => 'Giao dịch thành công',
            '07' => 'Trừ tiền thành công. Giao dịch bị nghi ngờ',
            '09' => 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
            '10' => 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11' => 'Đã hết hạn chờ thanh toán',
            '12' => 'Thẻ/Tài khoản bị khóa',
            '13' => 'Nhập sai mật khẩu xác thực giao dịch (OTP)',
            '24' => 'Khách hàng hủy giao dịch',
            '51' => 'Tài khoản không đủ số dư',
            '65' => 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
            '75' => 'Ngân hàng thanh toán đang bảo trì',
            '79' => 'Nhập sai mật khẩu thanh toán quá số lần quy định',
            '99' => 'Các lỗi khác',
        ];

        return $messages[$responseCode] ?? 'Lỗi không xác định';
    }
}
