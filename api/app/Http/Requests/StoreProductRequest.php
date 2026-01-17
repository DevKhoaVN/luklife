<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:5120',  // ví dụ: ảnh, max 5MB
            // hoặc nếu bắt buộc: 'thumbnail' => 'required|image|mimes:jpg,jpeg,png|max:5120',

            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],   // bool → boolean (Laravel chấp nhận cả hai)
            'is_featured' => ['boolean'],

            // Category
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],  // bỏ comment để validate tồn tại

            // Variants - sửa quan trọng ở đây
            'variants' => ['required', 'array', 'min:1'],  // bắt buộc có ít nhất 1 variant
            // KHÔNG ghi 'variants' => 'nullable' nữa, vì ghi đè rule trên

            'variants.*.color'          => ['required', 'string', 'max:100'],
            'variants.*.size'           => ['required', 'string', 'max:50'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
            'variants.*.sale_price'     => ['nullable', 'numeric', 'min:0'],
            'variants.*.is_active'      => ['boolean'],

            // Rule cho ảnh variant - đây là phần bị thiếu
            'variants.*.image_url' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            // hoặc nếu bắt buộc ảnh cho mỗi variant:
            // 'variants.*.image_url' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }
}
