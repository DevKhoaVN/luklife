<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAddressRequest extends FormRequest
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
            //
            'recipient_name'  => 'required|string|max:255',
            'recipient_phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'address_line1'   => 'required|string|max:255',
            'address_line2'   => 'nullable|string|max:255',

            // Thông tin tên (hiển thị)
            'ward'            => 'nullable|string|max:100',
            'district'        => 'required|string|max:100',
            'city'            => 'required|string|max:100',

            // Bổ sung các mã Code (để làm việc với API vận chuyển)
            'province_code'   => 'nullable|string|max:20',
            'district_code'   => 'nullable|string|max:20',
            'ward_code'       => 'nullable|string|max:20',

            'postal_code'     => 'nullable|string|max:20',
            'country'         => 'nullable|string|max:100',
            'is_default'      => 'nullable|boolean',
            'address_type'    => 'nullable|in:home,office,other',
        ];
    }
}
