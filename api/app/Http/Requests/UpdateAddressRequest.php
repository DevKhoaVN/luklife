<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
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
            'recipient_name'  => 'sometimes|required|string|max:255',
            'recipient_phone' => 'sometimes|required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'address_line1'   => 'sometimes|required|string|max:255',
            'address_line2'   => 'nullable|string|max:255',

            // Cụm thông tin địa chỉ: Dùng sometimes để nếu truyền cái này thì không được để trống
            'city'            => 'sometimes|required|string|max:100',
            'province_code'   => 'sometimes|required|string|max:20',

            'district'        => 'sometimes|required|string|max:100',
            'district_code'   => 'sometimes|required|string|max:20',

            'ward'            => 'sometimes|required|string|max:100',
            'ward_code'       => 'sometimes|required|string|max:20',

            'postal_code'     => 'nullable|string|max:20',
            'country'         => 'sometimes|string|max:100',
            'is_default'      => 'sometimes|boolean',
            'address_type'    => 'sometimes|in:home,office,other',
        ];
    }
}
