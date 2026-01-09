<?php

namespace App\Repositories\Contracts;

interface CartRepositoryInterface
{
    // Tìm biến thể dựa trên màu và size
    public function findVariant($productId, $color, $size);

    // Lấy hoặc tạo giỏ hàng theo User ID hoặc Session ID
    public function firstOrCreateCart($userId, $sessionId);

    // Thêm sản phẩm vào giỏ (hoặc cập nhật số lượng nếu đã có)
    public function addOrUpdateItem($cartId, $variantId, $quantity);

    // Lấy toàn bộ giỏ hàng để hiển thị
    public function getCartDetails($cartId);
}
