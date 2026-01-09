<?php

namespace App\Repositories\Iml;

use App\Models\cart;
use App\Models\cart_items;
use App\Models\product_variants;
use App\Repositories\Contracts\CartRepositoryInterface;

class CartRepository implements CartRepositoryInterface
{
    public function findVariant($productId, $color, $size)
    {
        // Tìm biến thể khớp với Product ID, Màu và Size
        return product_variants::where('product_id', $productId)
            ->where('color', $color) // Có thể là null
            ->where('size', $size)   // Có thể là null
            ->first();
    }

    public function firstOrCreateCart($userId, $sessionId)
    {
        // Nếu có User thì tìm theo User, không thì tìm theo Session
        $query = Cart::query();

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('session_id', $sessionId);
        }

        return $query->firstOrCreate([], [
            'user_id' => $userId,
            'session_id' => $sessionId
        ]);
    }

    public function addOrUpdateItem($cartId, $variantId, $quantity)
    {
        // Tìm xem sản phẩm này đã có trong giỏ chưa
        $item = cart_items::where('cart_id', $cartId)
            ->where('variant_id', $variantId)
            ->first();

        if ($item) {
            // Nếu có rồi -> Cộng dồn số lượng
            $item->quantity += $quantity;
            $item->save();
            return $item;
        }

        // Nếu chưa có -> Tạo dòng mới
        return cart_items::create([
            'cart_id' => $cartId,
            'variant_id' => $variantId,
            'quantity' => $quantity
        ]);
    }

    public function getCartDetails($cartId)
    {
        return cart::with(['items.variant.product', 'items.variant']) // Eager load để lấy thông tin sản phẩm
            ->find($cartId);
    }
}
