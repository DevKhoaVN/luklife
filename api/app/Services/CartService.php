<?php

namespace App\Services;

use App\Repositories\Contracts\CartRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CartService
{
    protected $cartRepo;

    public function __construct(CartRepositoryInterface $cartRepo)
    {
        $this->cartRepo = $cartRepo;
    }

    public function addToCart($data, $userId, $sessionId)
    {
        DB::beginTransaction();
        try {
            // 1. Tìm biến thể sản phẩm (Variant)
            // Client gửi product_id, color, size -> Ta phải tìm ra variant_id
            $variant = $this->cartRepo->findVariant(
                $data['product_id'],
                $data['color'] ?? null,
                $data['size'] ?? null
            );

            if (!$variant) {
                throw new Exception("Sản phẩm với màu sắc/kích thước này không tồn tại.");
            }

            // (Optional) Kiểm tra tồn kho tại đây
            if ($variant->stock_quantity < $data['quantity']) {
                throw new Exception("Sản phẩm này chỉ còn " . $variant->stock_quantity . " cái.");
            }

            // 2. Lấy hoặc tạo Giỏ hàng (Cart)
            $cart = $this->cartRepo->firstOrCreateCart($userId, $sessionId);

            // 3. Thêm item vào giỏ
            $this->cartRepo->addOrUpdateItem($cart->id, $variant->id, $data['quantity']);

            DB::commit();

            // 4. Trả về giỏ hàng mới nhất
            return [
                'success' => true,
                'message' => 'Thêm vào giỏ hàng thành công',
                'data' => $this->cartRepo->getCartDetails($cart->id)
            ];
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Lỗi thêm giỏ hàng: " . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
