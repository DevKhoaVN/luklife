<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Utils\CodeGenerator;
use App\Models\Product as Product;
use App\Models\productVariant as ProductVariant;
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
            $orders = $this->orderRepo->all ($status, $perPage);

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

     public function updateStatus(string $orderId, array $data)
    {
        try {
         
            $order = $this->orderRepo->update($orderId, $data);

            if ($order->order_status === 'cancelled') {
                return [
                    'success' => false,
                    'message' => 'Không thể cập nhật trạng thái cho đơn hàng đã hủy'
                ];
            }

            return [
                'success' => true,
                'message' => 'Cập nhật trạng thái đơn hàng thành công',
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
    public function countOrders(){
        try{
        $count = $this->orderRepo->countOrders();
        return $count;
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    public function countRevenue(){
        try{
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