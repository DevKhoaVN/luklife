<?php

namespace App\Http\Controllers\v1\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }


    public function store(StoreProductRequest $request): JsonResponse
    {
        try {
            $product = $this->productService->create($request->validated());

            return response()->json([
                'status' => 'success',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function index(Request $request)
    {
        try {
            $products = $this->productService->getAllProduct();
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function update($id, UpdateProductRequest $request)
    {
        $products = $this->productService->update($id, $request->validated());
        return  response()->json([
            'status' => 'success',
            'data' => $products
        ], 200);
        try {
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'Lỗi khi cập nhật thông tin sản phẩm',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->productService->delete($id);
            return response()->json([
                'status' => 'success',
                'message' => 'Sản phẩm đã được xóa thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
