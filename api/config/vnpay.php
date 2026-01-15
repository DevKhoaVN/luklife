<?php

return [
    'tmn_code'     => env('VNPAY_TMN_CODE'),
    'hash_secret'  => env('VNPAY_HASH_SECRET'),
    'base_url'     => env('VNPAY_BASE_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
    'return_url'   => env('VNPAY_RETURN_URL'),
];
