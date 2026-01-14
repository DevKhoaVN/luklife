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
            'category'  => ['nullable', 'string'],
            'sort'           => ['nullable', 'string', 'in:price_desc,price_asc,name_asc,name_desc,newest,oldest'],
            'page'       => ['nullable', 'integer', 'min:1', 'max:100'],
            'priceMax'  => ['nullable', 'integer', 'min:0', 'max:10000000'],
            'child_category'  => ['nullable', 'string'],
            'color'  => ['nullable', 'string'],
        ];
    }

    // Helper methods để lấy giá trị sạch
    public function getSearch(): ?string
    {
        return $this->input('search');
    }

    public function getCategory(): string
    {
        return $this->input('category', '');
    }

    public function getSort(): string
    {
        return $this->input('sort', 'newest'); // mặc định mới nhất
    }

    public function getPage(): int
    {
        return $this->input('page', 15);
    }
    public function getPriceMax(): int
    {
        return $this->input('priceMax', 1499000);
    }
    public function getChildCategory()
    {
        return $this->input('child_category', null);
    }
    public function getColor()  
    {
        return $this->input('color', null);
    }
}
