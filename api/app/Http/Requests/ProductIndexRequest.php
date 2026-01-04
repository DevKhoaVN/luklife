<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductIndexRequest extends FormRequest
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
            'search'         => ['nullable', 'string', 'max:255'],
            'category_slug'  => ['nullable', 'array'],
            'category_slug.*' => ['string', 'exists:categories,slug'],
            'sort'           => ['nullable', 'string', 'in:price_desc,price_asc,name_asc,name_desc,newest,oldest'],
            'per_page'       => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    // Helper methods để lấy giá trị sạch
    public function getSearch(): ?string
    {
        return $this->input('search');
    }

    public function getCategorySlugs(): array
    {
        return $this->input('category_slug', []);
    }

    public function getSort(): string
    {
        return $this->input('sort', 'newest'); // mặc định mới nhất
    }

    public function getPerPage(): int
    {
        return $this->input('per_page', 15);
    }
}
