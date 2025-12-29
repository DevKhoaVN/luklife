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
            // Tên sản phẩm: Bắt buộc, là chuỗi, tối đa 255 ký tự
            'name' => 'required|string|max:255',

            // Giá chung: Bắt buộc, phải là số (numeric), không được âm (min:0)
            'price' => 'required|numeric|min:0',

            // Giảm giá: Có thể bỏ trống (nullable), là số nguyên, từ 0 đến 100%
            'discount_percentage' => 'nullable|integer|min:0|max:100',

            // Mô tả: Có thể bỏ trống, là chuỗi
            'description' => 'nullable|string',

            // 'category_ids' phải là một mảng (ví dụ: [1, 5])
            'category_ids' => 'required|array',

            // Kiểm tra từng phần tử trong mảng đó (dấu * đại diện cho từng ID)
            // exists:categories,id nghĩa là: Tìm trong bảng 'categories', cột 'id' xem có tồn tại số này không?
            // Nếu gửi id=999 mà DB không có => Lỗi ngay.
            'category_ids.*' => 'exists:categories,id',


            // 'variants' bắt buộc phải là mảng và phải có ít nhất 1 phần tử (min:1)
            'variants' => 'required|array|min:1',

            // Kiểm tra SKU của TỪNG biến thể (dấu * đại diện cho dòng 1, dòng 2...)
            // distinct: Trong mảng gửi lên không được có 2 dòng trùng SKU
            // unique:product_variants,sku: Kiểm tra trong DB bảng product_variants cột sku, không được trùng cái đã có.
            'variants.*.sku' => 'required|string|distinct|unique:product_variants,sku',

            // Số lượng tồn kho: Bắt buộc, là số nguyên, >= 0
            'variants.*.stock_quantity' => 'required|integer|min:0',

            // Giá riêng của biến thể (nếu có): Có thể null, là số
            'variants.*.sale_price' => 'nullable|numeric|min:0',

            // Màu và Size (tùy chọn)
            'variants.*.color' => 'nullable|string',
            'variants.*.size' => 'nullable|string',
        ];
    }
    public function message(){
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

