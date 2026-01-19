<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Utils\CodeGenerator;
use App\Models\Product;
use App\Models\OrderItems;
use App\Models\Discount;
use App\Models\ProductVariant;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;
use App\Repositories\Contracts\OrderRepositoriesInterface;
use Illuminate\Database\Eloquent\Builder;
use  Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderService
{

    public function __construct(protected OrderRepositoriesInterface $orderRepo) {}

    protected function getUserId(): int
    {
        return JWTAuth::parseToken()->authenticate()->id;
    }
    protected function restoreStockAndCoupon($orderId)
    {
        // 1. Lấy chi tiết các món trong đơn hàng đó
        $items = OrderItems::where('order_id', $orderId)->get();

        foreach ($items as $item) {
            // Cộng lại số lượng vào kho
            // Dùng increment cho an toàn (tránh race condition)
            ProductVariant::where('id', $item->variant_id)
                ->increment('stock_quantity', $item->quantity);
        }

        // 2. Hoàn lại lượt dùng Coupon (nếu đơn hàng có dùng mã)
        // Lấy thông tin đơn hàng để check coupon_id
        $order = $this->orderRepo->findById($orderId);

        if ($order && $order->coupon_id) {
            $coupon = Discount::find($order->coupon_id);
            if ($coupon) {
                // Trừ đi 1 lượt đã dùng (để mã đó có thể dùng lại)
                // Kiểm tra để không bị trừ về số âm
                if ($coupon->used_count > 0) {
                    $coupon->decrement('used_count');
                }
            }
        }
    }
    /**
     * Create new order
     */
    public function createOrder(array $data)
    {
        DB::beginTransaction();

        try {
            // Lấy user_id từ JWT token
            $userId = $this->getUserId();

            // Tạo đơn hàng
            $order = $this->orderRepo->create($userId, $data);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Tạo đơn hàng thành công',
                'data' => $order
            ];
        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }


    /**
     * Get all orders with pagination
     */
    public function getAllOrders(int $perPage = 10, string $status)
    {
        try {
            $orders = $this->orderRepo->all($status, $perPage);

            return [
                'success' => true,
                'message' => 'Lấy danh sách đơn hàng thành công',
                'data' => $orders
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    public function getMyOrders(int $perPage = 10)
    {
        try {
            $userId = $this->getUserId();

            $orders = $this->orderRepo->findByUserId($userId, $perPage);

            return [
                'success' => true,
                'message' => 'Lấy danh sách đơn hàng thành công',
                'data' => $orders
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get order detail
     */
    public function getOrderDetail(string $orderId)
    {
        try {
            $order = $this->orderRepo->getOrderById($orderId);

            if (!$order) {
                return [
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ];
            }

            return [
                'success' => true,
                'message' => 'Lấy thông tin đơn hàng thành công',
                'data' => $order
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    /**
     * Cancel order
     */
    public function cancelOrder(int $orderId, string $reason = null)
    {
        DB::beginTransaction();

        try {
            $userId = $this->getUserId();
            $order = $this->orderRepo->findById($orderId);

            if (!$order) {
                return [
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ];
            }

            // Kiểm tra quyền hủy đơn
            if ($order->user_id !== $userId) {
                return [
                    'success' => false,
                    'message' => 'Bạn không có quyền hủy đơn hàng này'
                ];
            }

            // Kiểm tra trạng thái đơn hàng
            if (!in_array($order->order_status, ['pending', 'confirmed'])) {
                return [
                    'success' => false,
                    'message' => 'Không thể hủy đơn hàng ở trạng thái này'
                ];
            }

            $order = $this->orderRepo->update($orderId, [
                'order_status' => 'cancelled',
                'cancelled_reason' => $reason
            ]);
            $this->restoreStockAndCoupon($orderId);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Hủy đơn hàng thành công',
                'data' => $order
            ];
        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    /**
     * Delete order (soft delete)
     */
    public function deleteOrder(int $orderId)
    {
        try {
            $result = $this->orderRepo->delete($orderId);

            return [
                'success' => $result,
                'message' => $result ? 'Xóa đơn hàng thành công' : 'Không tìm thấy đơn hàng'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Update Status (Admin cập nhật - Có thể admin set hủy hoặc trả hàng)
     */
    public function updateStatus(string $orderId, array $data)
    {
        DB::beginTransaction();
        try {
            // Lấy trạng thái cũ trước khi update để so sánh
            $oldOrder = $this->orderRepo->findById($orderId);

            // Cập nhật trạng thái mới
            $order = $this->orderRepo->update($orderId, $data);

            if (!$oldOrder) {
                return ['success' => false, 'message' => 'Đơn hàng không tồn tại'];
            }

            // Nếu Admin chuyển trạng thái sang 'cancelled' (Hủy) hoặc 'returned' (Trả hàng)
            // Và trạng thái cũ chưa phải là 2 trạng thái này (để tránh hoàn kho 2 lần)
            $isCancelledOrReturned = in_array($data['order_status'], ['cancelled', 'returned']);
            $wasNotCancelledOrReturned = !in_array($oldOrder->order_status, ['cancelled', 'returned']);

            if ($isCancelledOrReturned && $wasNotCancelledOrReturned) {
                // [QUAN TRỌNG] GỌI HÀM HOÀN KHO
                $this->restoreStockAndCoupon($orderId);
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Cập nhật trạng thái đơn hàng thành công',
                'data' => $order
            ];
        } catch (Exception $e) {
            DB::rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Get orders by order status
     */
    public function getOrdersByStatus(string $status, int $perPage = 10)
    {
        try {
            $orders = $this->orderRepo->getByOrderStatus($status, $perPage);

            return [
                'success' => true,
                'message' => 'Lấy danh sách đơn hàng thành công',
                'data' => $orders
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    public function countOrders()
    {
        try {
            $count = $this->orderRepo->countOrders();
            return $count;
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    public function countRevenue()
    {
        try {
            $revenue = $this->orderRepo->countRevenue();
            return $revenue;
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
