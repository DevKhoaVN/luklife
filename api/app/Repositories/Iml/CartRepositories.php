<?php

namespace App\Repositories\Iml;

use App\Models\CartItem;
use App\Models\Cart;
use App\Repositories\Contracts\CartRepositoriesInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\ModelNotFoundException;


// Đổi tên lớp cho phù hợp với nghiệp vụ
class CartRepositories implements CartRepositoriesInterface
{


    public function findUserCart(int $userId): Cart
    {
        $cart =  Cart::firstOrCreate(
            ['user_id' => $userId],
            ['session_id' => null]
        );

        $cart->load([
            // Load CartItem
            'items' => function ( $query) {
                // Trong quan hệ CartItem, load tiếp Variant và Product
                $query->with('variant.product');
            }
        ]);

        return $cart;
    }



    public function saveItem(CartItem $item): CartItem
    {
        $item->save();
        return $item->fresh();
    }

    public function deleteItemFromCart(int $cartId, $variantId): bool
    {
        // Tìm và xóa item dựa trên cả cart_id và variant_id
        $deletedCount = CartItem::where('cart_id', $cartId)
            ->where('variant_id', $variantId)
            ->delete();

        // Trả về true nếu có ít nhất 1 dòng bị xóa, ngược lại false
        return $deletedCount > 0;
    }


  
    public function findExistingItem(int $cartId, int $productId, ?string $variantId): ?CartItem
    {
        return CartItem::where('cart_id', $cartId)
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId)
            ->first();
    }


    public function updateItemQuantity(int $cartId, int $variantId, int $quantity, int $price): bool
    {
        $cartItem = CartItem::where('cart_id', $cartId)
            ->where('variant_id', $variantId)
            ->first();

        // 2. Xử lý nếu không tìm thấy (Vẫn giữ nguyên, nên ném lỗi)
        if (!$cartItem) {
            throw new ModelNotFoundException('Không tìm thấy mục hàng này trong giỏ.');
        }

        // 3. Xử lý xóa nếu số lượng <= 0
        if ($quantity <= 0) {
            // delete() trả về số lượng bản ghi đã xóa (int)
            $isDeleted = $cartItem->delete();
            // Trả về true nếu xóa thành công (1 bản ghi đã bị xóa)
            return $isDeleted > 0;
        }

        // 4. Cập nhật số lượng (quantity > 0)
        $cartItem->fill([
            'quantity' => $quantity,
            'price' => $price
        ]);

        // Kiểm tra xem có thay đổi nào cần lưu không
        if ($cartItem->isDirty()) {
            // save() trả về bool (true nếu lưu thành công, false nếu không có gì thay đổi)
            return $cartItem->save();
        }

        // 5. Nếu không có gì thay đổi (quantity mới = quantity cũ), vẫn coi là thành công
        return true;
    }
}
