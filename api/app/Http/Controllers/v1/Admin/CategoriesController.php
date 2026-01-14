<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category as Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Services\CategoriesService;
use Illuminate\Http\Request;

class CategoriesController extends Controller   
{
    protected CategoriesService $categoryService;

    public function __construct(CategoriesService $categoryService) {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $categories = $this->categoryService->getAllCategories(20);
        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();

        $result =  $this->categoryService->store($data);

        return response()->json($result);
    }

    public function update(UpdateCategoryRequest $request)
    {
        $data = $request->validated();

        $reuslt =  $this->categoryService->update($data);

        return response()->json($reuslt);
    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');

        //2. Validation Thủ công (Kiểm tra ID là số nguyên dương)
        if (!is_numeric($id) || $id <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'ID danh mục không hợp lệ hoặc bị thiếu.'
            ], 400); // 400 Bad Request
        }
        $reuslt =  $this->categoryService->delete($id);
        return response()->json($reuslt);
    }
}
