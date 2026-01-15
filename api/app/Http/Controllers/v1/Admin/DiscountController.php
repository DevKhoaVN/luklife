<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Controllers\Controller;
use App\Services\DiscountService;
use App\Http\Requests\DiscountRequest;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    protected $discountService;

    public function __construct(DiscountService $discountService)
    {
        $this->discountService = $discountService;
    }

    /**
     * Hiển thị danh sách mã giảm giá
     */
    public function getAllDiscounts(Request $request)
    {
        $discounts = $this->discountService->getAllDiscounts();
         return response()->json($discounts);
    }


    /**
     * Lưu mã giảm giá mới
     */
    public function createDiscount(DiscountRequest $request)
    {
        $result =  $this->discountService->createDiscount($request->validated());
        return response()->json($result);
    }

    /**
     * Hiển thị chi tiết mã giảm giá
     */
    public function getDiscountById($id)
    {
        $discount = $this->discountService->getDiscountById($id);
    
    }


    /**
     * Cập nhật mã giảm giá
     */
    public function updateDiscount(DiscountRequest $request, $id)
    {
           $result =  $this->discountService->updateDiscount($id, $request->validated());
            return response()->json($result);  
    }

    /**
     * Xóa mã giảm giá
     */
    public function deleteDiscount($id)
    {
        $result =  $this->discountService->deleteDiscount($id);
        return response()->json($result);
    }

    /**
     * Toggle trạng thái active
     */
    public function toggleStatus($id)
    {
        try {
            $discount = $this->discountService->toggleStatus($id);

            return response()->json([
                'success' => true,
                'is_active' => $discount->is_active,
                'message' => $discount->is_active ? 'Đã kích hoạt' : 'Đã tắt'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * API: Validate và áp dụng mã giảm giá
     */
    public function applyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'order_value' => 'required|numeric|min:0',
        ]);

        try {
            $result = $this->discountService->validateAndCalculate(
                $request->code,
                $request->order_value
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'discount_code' => $result['discount']->code,
                    'discount_name' => $result['discount']->name,
                    'discount_type' => $result['discount']->type,
                    'discount_value' => $result['discount']->value,
                    'discount_amount' => $result['discount_amount'],
                    'final_amount' => $result['final_amount'],
                ],
                'message' => $result['message'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
