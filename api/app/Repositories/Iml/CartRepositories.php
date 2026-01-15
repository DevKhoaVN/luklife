<?php

namespace App\Repositories\Iml;

use App\Models\cart_items as CartItem;
use App\Models\cart as Cart;
use App\Repositories\Contracts\CartRepositoriesInterface;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
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
            'items' => function ($query) {
                // Trong quan hệ CartItem, load tiếp Variant và Product
                $query->with('variant.product');
            }
        ]);

        return $cart;
    }


    public function findGuestCart(string $sessionId): Cart
    {
        // 1. Tìm hoặc tạo mới Cart
        $cart = Cart::firstOrCreate(
            ['session_id' => $sessionId, 'user_id' => null]
        );

        // 2. Eager Load các mối quan hệ cần thiết, giống như findUserCart
        $cart->load([
            // Load CartItem
            'items' => function ($query) {
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



    public function deleteCartItems(int $cartItemId): bool
    {
        $deletedCount = CartItem::destroy($cartItemId);
        return $deletedCount > 0;
    }



    public function findExistingItem(int $cartId, int $productId, ?string $variantId): ?CartItem
    {
        return CartItem::where('cart_id', $cartId)
            ->where('product_id', $productId)
            ->where('variant_id', $variantId)
            ->first();
    }


    public function updateItemQuantity(int $cartId, int $variantId, int $quantity): bool
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
            'quantity' => $quantity
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
