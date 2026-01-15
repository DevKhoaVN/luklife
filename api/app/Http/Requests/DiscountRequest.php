<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DiscountRequest extends FormRequest
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
            'code' => 'required|string|max:50', 
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount_value' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ];
    }
    public function messages(): array
    {
        return [
            'code.required'              => 'Vui lòng nhập mã giảm giá.',
            'code.string'                => 'Mã giảm giá phải là chuỗi ký tự.',
            'code.max'                   => 'Mã giảm giá không được dài quá 50 ký tự.',

            'name.required'              => 'Vui lòng nhập tên chương trình giảm giá.',
            'name.string'                => 'Tên phải là chuỗi ký tự.',
            'name.max'                   => 'Tên không được dài quá 255 ký tự.',

            'type.required'              => 'Vui lòng chọn loại giảm giá.',
            'type.in'                    => 'Loại giảm giá chỉ được là: percentage hoặc fixed.',

            'value.required'             => 'Vui lòng nhập giá trị giảm giá.',
            'value.numeric'              => 'Giá trị giảm phải là số.',
            'value.min'                  => 'Giá trị giảm không được nhỏ hơn 0.',

            'min_order_value.numeric'    => 'Giá trị đơn hàng tối thiểu phải là số.',
            'min_order_value.min'        => 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0.',

            'max_discount_value.numeric' => 'Mức giảm tối đa phải là số.',
            'max_discount_value.min'     => 'Mức giảm tối đa không được nhỏ hơn 0.',

            'start_date.date'            => 'Ngày bắt đầu không đúng định dạng ngày.',

            'end_date.date'              => 'Ngày kết thúc không đúng định dạng ngày.',
            'end_date.after_or_equal'    => 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.',

            'is_active.boolean'          => 'Trạng thái hoạt động phải là giá trị đúng/sai (boolean).',
        ];
    }
}
