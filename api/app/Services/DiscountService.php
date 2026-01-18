<?php

namespace App\Services;

use App\Models\Discount;
use App\Repositories\Contracts\DiscountRepositoriesInterface;
use Exception;

class DiscountService
{
    protected $discountRepository;

    public function __construct(DiscountRepositoriesInterface $discountRepository)
    {
        $this->discountRepository = $discountRepository;
    }

    public function getAllDiscounts()
    {
        try {
            $reusult =  $this->discountRepository->paginate();
            return [
                'success' => true,
                'message' => 'Lấy danh sách mã giảm giá thành công',
                'data' => $reusult
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getDiscountById($id)
    {
        return $this->discountRepository->find($id);
    }

    public function createDiscount(array $data)
    {
        try {
            $reusult =  $this->discountRepository->create($data);
            return [
                'success' => true,
                'message' => 'Tạo  mã giảm giá thành công',
                'data' => $reusult
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function updateDiscount($id, array $data)
    {
        try {
            $reusult =   $this->discountRepository->update($id, $data);
            return [
                'success' => true,
                'message' => 'Cập nhật mã giảm giá thành công',
                'data' => $reusult
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function deleteDiscount($id)
    {
        try {
            $reusult =  $this->discountRepository->delete($id);
            return [
                'success' => true,
                'message' => 'Xóa mã giảm giá thành công',

            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function searchDiscounts($keyword)
    {
        try {
            $reusult =  $this->discountRepository->search($keyword);
            return [
                'success' => true,
                'message' => 'Tìm kiếm mã giảm giá thành công',
                'data' => $reusult
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate mã giảm giá và tính toán số tiền giảm
     * 
     * @param string $code - Mã giảm giá
     * @param float $orderValue - Giá trị đơn hàng
     * @return array
     * @throws Exception
     */
    public function validateAndCalculate($code, $orderValue)
    {
        // Tìm discount theo code
        $discount = $this->discountRepository->findByCode($code);

        if (!$discount) {
            throw new Exception('Mã giảm giá không tồn tại!');
        }

        // Kiểm tra tính hợp lệ
        if (!$discount->is_active) {
            throw new Exception('Mã giảm giá không còn hiệu lực!');
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if ($orderValue < $discount->min_order_value) {
            throw new Exception(
                'Đơn hàng tối thiểu ' .
                    number_format($discount->min_order_value, 0, ',', '.') .
                    ' VNĐ để áp dụng mã này!'
            );
        }

        // Tính toán số tiền giảm
        $discountAmount = $this->calculateDiscountAmount($discount, $orderValue);

        return [
            'discount' => $discount,
            'discount_amount' => $discountAmount,
            'final_amount' => max(0, $orderValue - $discountAmount),
            'shipping_discount' => $discount->discount_type === 'free_shipping' ? 30000 : 0,
            'message' => 'Áp dụng mã giảm giá thành công!',
        ];
    }

    /**
     * Tính toán số tiền giảm giá
     * 
     * @param Discount $discount
     * @param float $orderValue
     * @return float
     */
    protected function calculateDiscountAmount($discount, $orderValue)
    {
        $discountAmount = 0;

        switch ($discount->type) {
            case Discount::TYPE_PERCENTAGE:
                // Giảm theo phần trăm
                $discountAmount = ($orderValue * $discount->value) / 100;

                // Áp dụng giới hạn giảm tối đa nếu có
                if ($discount->max_discount_value) {
                    $discountAmount = min($discountAmount, $discount->max_discount_value);
                }
                break;

            case Discount::TYPE_FIXED:
                // Giảm số tiền cố định (không vượt quá giá trị đơn hàng)
                $discountAmount = min($discount->value, $orderValue);
                break;
        }

        return round($discountAmount, 2);
    }

    /**
     * Toggle trạng thái active/inactive
     */
    public function toggleStatus($id)
    {
        $discount = $this->discountRepository->find($id);
        $discount->update(['is_active' => !$discount->is_active]);
        return $discount->fresh();
    }

    public function applyCoupon($code, $totalAmount)
    {

        $coupon = Discount::where('code', $code)->first();

        if (!$coupon) {
            throw new Exception("Mã giảm giá '{$code}' không tồn tại.");
        }

        if (!$coupon->isValid()) {
            throw new Exception("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        }

        if ($coupon->min_order_value && $totalAmount < $coupon->min_order_value) {
            throw new Exception("Đơn hàng phải từ " . number_format($coupon->min_order_value) . "đ mới được dùng mã này.");
        }

        $discountAmount = $this->calculateDiscountAmount($coupon, $totalAmount);

        return [
            'discount_id' => $coupon->id,
            'discount_amount' => $discountAmount,
            'coupon_obj' => $coupon
        ];
    }
}
