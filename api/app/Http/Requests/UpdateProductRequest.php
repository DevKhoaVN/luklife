<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

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
     */
    public function rules(): array
    {
        return [
            // 1. THUMBNAIL: Chấp nhận cả URL cũ (string) HOẶC File ảnh mới (UploadedFile)
            'thumbnail' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    // Nếu là chuỗi (URL ảnh cũ) -> Cho qua
                    if (is_string($value)) return;
                    // Nếu là File upload -> Check định dạng
                    if ($value instanceof UploadedFile) {
                        $extension = $value->getClientOriginalExtension();
                        if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                            $fail("Ảnh đại diện phải là định dạng: jpg, jpeg, png, webp, gif.");
                        }
                        if ($value->getSize() > 5120 * 1024) { // 5MB
                            $fail("Dung lượng ảnh không được vượt quá 5MB.");
                        }
                        return;
                    }
                    $fail("Ảnh đại diện không hợp lệ (phải là URL hoặc File upload).");
                },
            ],

            // 2. CÁC TRƯỜNG CƠ BẢN: Dùng 'sometimes' để cho phép cập nhật lẻ tẻ
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],

            // 3. CATEGORY: Có thể rỗng (nếu không muốn đổi danh mục)
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],

            // 4. VARIANTS (QUAN TRỌNG)
            'variants' => ['nullable', 'array'],

            // Validate ID của variant (để biết dòng nào update, dòng nào thêm mới)
            'variants.*.id' => ['nullable', 'integer', 'exists:productvariant,id'],
            // Lưu ý: Tên bảng trong DB bạn là 'productvariant' (không 's')

            'variants.*.color'          => ['required_with:variants', 'string', 'max:100'],
            'variants.*.size'           => ['required_with:variants', 'string', 'max:50'],
            'variants.*.stock_quantity' => ['required_with:variants', 'integer', 'min:0'],
            'variants.*.sale_price'     => ['nullable', 'numeric', 'min:0'],
            'variants.*.is_active'      => ['boolean'],

            // 5. ẢNH BIẾN THỂ: Logic tương tự Thumbnail (URL cũ hoặc File mới)
            'variants.*.image_url' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if (is_string($value)) return; // URL cũ
                    if ($value instanceof UploadedFile) { // File mới
                        $extension = $value->getClientOriginalExtension();
                        if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                            $fail("Ảnh biến thể phải là định dạng ảnh hợp lệ.");
                        }
                        return;
                    }
                    $fail("Ảnh biến thể không hợp lệ.");
                }
            ],
        ];
    }
}
