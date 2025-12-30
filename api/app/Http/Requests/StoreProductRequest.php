<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool //Ai được phép gửi
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'description' => 'nullable|string',
            'category_ids' => 'required|array',
            // Kiểm tra từng phần tử trong mảng đó (dấu * đại diện cho từng ID)
            // exists:categories,id nghĩa là: Tìm trong bảng 'categories', cột 'id' xem có tồn tại số này không?
            // Nếu gửi id=999 mà DB không có => Lỗi ngay.
            'category_ids.*' => 'exists:categories,id',
            'variants' => 'required|array|min:1',

            // Kiểm tra SKU của TỪNG biến thể (dấu * đại diện cho dòng 1, dòng 2...)
            // distinct: Trong mảng gửi lên không được có 2 dòng trùng SKU
            // unique:product_variants,sku: Kiểm tra trong DB bảng product_variants cột sku, không được trùng cái đã có.
            'variants.*.sku' => 'required|string|distinct|unique:product_variants,sku',
            'variants.*.stock_quantity' => 'required|integer|min:0',
            'variants.*.sale_price' => 'nullable|numeric|min:0',
            'variants.*.color' => 'nullable|string',
            'variants.*.size' => 'nullable|string',
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'Bạn chưa nhập tên sản phẩm.',
            'price.min' => 'Giá sản phẩm không được nhỏ hơn 0.',
            'category_ids.required' => 'Vui lòng chọn ít nhất một danh mục.',
            'variants.required' => 'Sản phẩm phải có ít nhất một biến thể (Màu/Size).',

            // :attribute sẽ được thay thế bằng tên trường
            'variants.*.sku.unique' => 'Mã SKU này đã tồn tại trong hệ thống.',
            'variants.*.sku.distinct' => 'Bạn đang nhập trùng mã SKU trong danh sách.',
        ];
    }
}
