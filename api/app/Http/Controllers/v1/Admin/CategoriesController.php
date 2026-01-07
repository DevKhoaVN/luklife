<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Services\CategoriesService;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    protected CategoriesService $categoryService;

    public function __construct(CategoriesService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $result = $this->categoryService->getAllCategories();
        $statusCode = $result['success'] ? 200 : 500;

        return response()->json($result, $statusCode);
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();

        $result = $this->categoryService->store($data);

        $statusCode = $result['success'] ? 201 : 500;

        return response()->json($result, $statusCode);
    }

    public function update($id, UpdateCategoryRequest $request)
    {
        $data = $request->validated();
        $result = $this->categoryService->update($id, $data);
        $statusCode = $result['success'] ? 200 : 400;
        return response()->json($result, $statusCode);
    }
    public function destroy($id)
    {
        $result = $this->categoryService->delete($id);
        $statusCode = $result['success'] ? 200 : 400;
        return response()->json($result, $statusCode);
    }
}
