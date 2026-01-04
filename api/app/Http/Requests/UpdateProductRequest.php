<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',

            'variants' => 'required|array',

            'variant.*.id' => 'nullable|integer|exists:product_variants,id',
            'variants.*.sku' => 'required|string',
            'variants.*.stock_quantity' => 'required|integer|min:0',
            // 'variants.*.stock_quantity' => 'integer|min:0',
            'variants.*.sale_price' => 'required|numeric|min:0'
        ];
    }
}
