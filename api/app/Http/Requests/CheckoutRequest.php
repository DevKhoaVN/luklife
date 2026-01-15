<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|regex:/^0[0-9]{9,10}$/',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:cod,vnpay',
            'discount_code' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',

            'cart_items' => 'required|array|min:1',
            // 'cart_items.*.variant_id' => 'required|exists:productVariant,id',
            // 'cart_items.*.quantity' => 'required|integer|min:1',
            // 'cart_items.*.unit_price' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'recipient_name.required' => 'Tên người nhận là bắt buộc',
            'recipient_phone.required' => 'Số điện thoại là bắt buộc',
            'recipient_phone.regex' => 'Số điện thoại không hợp lệ',
            'shipping_address.required' => 'Địa chỉ giao hàng là bắt buộc',
            'payment_method.required' => 'Phương thức thanh toán là bắt buộc',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ',
            'cart_items.required' => 'Giỏ hàng trống',
            'cart_items.min' => 'Giỏ hàng phải có ít nhất 1 sản phẩm',
        ];
    }
}
