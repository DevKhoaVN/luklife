<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Dùng 'sometimes' để chỉ validate khi người dùng có gửi trường đó lên
            'thumbnail'           => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'name'                => ['sometimes', 'string', 'max:255'],
            'price'               => ['sometimes', 'numeric', 'min:0'],
            'discount_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'description'         => ['nullable', 'string'],
            'is_active'           => ['boolean'],
            'is_featured'         => ['boolean'],

            // Categories
            'category_ids'   => ['sometimes', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],

            // Gallery
            'images'    => ['nullable', 'array'],
            'images.*'  => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],

            // Variants
            'variants'              => ['sometimes', 'array'],
            'variants.*.id'         => ['nullable', 'integer'], // ID biến thể (nếu sửa cái cũ)
            'variants.*.image_url'  => ['nullable', 'string'],
            'variants.*.color'      => ['sometimes', 'string', 'max:100'],
            'variants.*.size'       => ['sometimes', 'string', 'max:50'],
            'variants.*.sale_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock_quantity' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
