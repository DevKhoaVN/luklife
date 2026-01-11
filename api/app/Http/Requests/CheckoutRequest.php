<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Thông tin người nhận
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:cod,vnpay,momo',

            // Validate Giỏ hàng (Mảng các sản phẩm)
            'cart_items' => 'required|array|min:1', // Phải là mảng và có ít nhất 1 món

            // Validate chi tiết từng món trong mảng (Dấu .* nghĩa là kiểm tra từng phần tử)
            'cart_items.*.variant_id' => 'required|integer|exists:product_variants,id', // ID biến thể phải tồn tại trong DB
            'cart_items.*.quantity' => 'required|integer|min:1',
            'cart_items.*.unit_price' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'cart_items.*.variant_id.exists' => 'Sản phẩm bạn chọn không tồn tại trong hệ thống.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
        ];
    }
}
