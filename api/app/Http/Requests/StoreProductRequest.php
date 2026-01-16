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
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['bool'],
            'is_featured' => ['bool'],

            // Categories
            'category_ids' => ['required', 'array', 'min:1'],
            // 'category_ids.*' => ['integer', 'exists:categories,id'],

            // Variants
            'variants' => ['required', 'array', 'min:1'],
            'variants' => ['nullable'],
            'variants.*.image_url' => ['nullable', 'string', 'max:255'],
            'variants.*.color' => ['required', 'string', 'max:100'],
            'variants.*.size' => ['required', 'string', 'max:50'],
            'variants.*.sale_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
            'variants.*.is_active' => ['bool'],

            'images' => ['nullable', 'array'], // "images" phải là một danh sách (mảng)
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:2048'], // Mỗi file trong đó phải là ảnh, tối đa 2MB
        ];
    }
}
