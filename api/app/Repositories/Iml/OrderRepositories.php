<?php

namespace App\Repositories\Iml;

use App\Models\Orders;
use App\Repositories\Contracts\OrderRepositoriesInterface;
use Illuminate\Database\Eloquent\Collection;

class OrderRepositories implements OrderRepositoriesInterface
{
    /**
     * Get all orders
     */
    public function all(string $status = 'all', int $perPage = 10)
    {
        $query = Orders::query()
            ->orderBy('created_at', 'desc');

        // Debug SQL trước khi lọc
        // dd($query->toSql(), $query->getBindings());  // Uncomment để xem

        // Lọc status
        if ($status !== 'all' && $status !== '') {
            $query->where('order_status', $status);
        }

        // Debug sau khi lọc
        // dd($query->toSql(), $query->getBindings());

        $paginated = $query->paginate($perPage)->withQueryString();

        // Debug kết quả phân trang
        // dd($paginated->items(), $paginated->total());

        return $paginated;
    }    /**
     * Create new order
     */
    public function create(int $userId, array $data)
    {
        return Orders::create([
            'order_code' => $data['order_code'] ?? $this->generateOrderCode(),
            'vnpay_txn_ref' => $data['vnpay_txn_ref'] ?? null,
            'user_id' => $userId,
            'shipping_address_id' => $data['shipping_address_id'] ?? null,
            'recipient_name' => $data['recipient_name'],
            'recipient_phone' => $data['recipient_phone'],
            'shipping_address' => $data['shipping_address'],
            'total_amount' => $data['total_amount'] ?? 0,
            'discount_amount' => $data['discount_amount'] ?? 0,
            'shipping_fee' => $data['shipping_fee'] ?? 0,
            'grand_total' => $data['grand_total'] ?? 0,
            'order_status' => $data['order_status'] ?? 'pending',
            'payment_status' => $data['payment_status'] ?? 'unpaid',
            'payment_method' => $data['payment_method'] ?? 'cod',
            'notes' => $data['notes'] ?? null,
            'cancelled_reason' => $data['cancelled_reason'] ?? null,
        ]);
    }

    /**
     * Find order by ID
     */
    public function findById(int $orderId)
    {
        return Orders::find($orderId);
    }


    /**
     * Find order by  User ID
     */
    public function findByUserId(int $userId, int $perPage = 10)
    {
        return Orders::where('user_id', $userId)->orderBy('created_at', 'desc')->paginate($perPage);
    }
    /**
     * Update order
     */
    public function update(string $orderId, array $data)
    {
        $order = Orders::where('id', $orderId)->firstOrFail();

        $order->update($data);

        return $order->fresh();
    }

    /**
     * Delete order
     */
    public function delete(int $orderId): bool
    {
        $order = $this->findById($orderId);

        if (!$order) {
            return false;
        }

        return $order->delete();
    }

    public function getByOrderStatus(string $status, int $perPage = 10)
    {
        return Orders::with(['user:id,name,email'])
            ->where('order_status', $status)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
    /**
     * Generate unique order code
     */
    private function generateOrderCode(): string
    {
        return 'ORD' . date('YmdHis') . rand(1000, 9999);
    }

    public function countOrders()
    {
        return Orders::count();
    }

    public function countRevenue(){
        return Orders::where('order_status', 'delivered')->sum('grand_total');
    }

    public function getOrderByCode(string $orderId)
    {
        return Orders::with([
            // 1. Lấy danh sách item trong đơn hàng
            // 2. Trong mỗi item lấy thông tin biến thể (màu, size, sku...)
            // 3. Từ biến thể lấy ngược lên thông tin sản phẩm gốc (tên sp, mô tả...)
            'orderItems.variant.product',

            // Lấy thêm thông tin người dùng và địa chỉ nếu cần cho UI
            'user',
            'discount'
        ])
            ->where('order_code', $orderId) // Hoặc dùng findOrFail($orderId) nếu truyền ID số
            // ->where('order_code', $orderId) // Dùng cái này nếu bạn truyền mã ORD...
            ->firstOrFail();
    }

    public function getOrderById( int $orderId){
        $reuslt =  Orders::with([
           
            'orderItems.variant.product',
            'discount'
        ])->where('user_id', $orderId)->firstOrFail();
       return $reuslt;
    }
}
