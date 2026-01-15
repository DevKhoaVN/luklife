<?php

namespace App\Services;

use App\Models\cart as Cart;
use App\Models\cart_items as CartItem;
use App\Repositories\Contracts\CartRepositoriesInterface;
use App\Repositories\Contracts\ProductRepositoriesInterface;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\ItemNotFoundException;
use App\Models\product_variants as ProductVariant;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;

class CartService
{


    public function __construct(protected CartRepositoriesInterface $cartRepo, protected ProductRepositoriesInterface $productRepo) {}

    public function getCart(?int $userId = null): Cart
    {
        if ($userId) {
            return $this->cartRepo->findUserCart($userId);
        }

        $session_id = $this->getOrCreateCartSessionId();

        return $this->cartRepo->findGuestCart($session_id);
    }

    protected function getOrCreateCartSessionId(): string
    {

        if (!Session::has('cart_session_id')) {

            Session::put('cart_session_id', Str::uuid()->toString());
        }


        return Session::get('cart_session_id');
    }

    public function addItem(
        int $productId,
        int $quantity = 1,
        ?int $variantId = null,
        ?int $userId = null
    ): array {
        try {
            // 1. Lấy giỏ hàng
            $cart = $this->getCart($userId);

            // 2. Kiểm tra sản phẩm/biến thể 
            $product = $this->productRepo->findById($productId);

            if (!$product) {
                throw new ItemNotFoundException('Sản phẩm không tồn tại trong hệ thống');
            }
            $priceToUse = $product->price;

            if ($variantId) {
                $variant = ProductVariant::findOrFail($variantId);
                if ($variant->product_id !== $productId) {
                    throw new InvalidArgumentException('Variant ID không thuộc về Product ID này.');
                }
                $priceToUse = $variant->price ?? $product->price;
            }

            // 3. Tìm hoặc Tạo Cart Item (Sử dụng Repository)
            $existingItem = $this->cartRepo->findExistingItem($cart->id, $productId, $variantId);

            if ($existingItem) {
                $existingItem->quantity += $quantity;
                $cartItem = $this->cartRepo->saveItem($existingItem);
            } else {
                $newItem = new CartItem([
                    'cart_id' => $cart->id,
                    'product_id' => $productId,
                    'variant_id' => $variantId,
                    'quantity' => $quantity,
                    'price' => $priceToUse,
                ]);
                $cartItem = $this->cartRepo->saveItem($newItem);
            }

            return [
                'success' => true,
                'message' => "Thêm sản phẩm vào giỏ hàng thành công.",
                'data' => $cartItem
            ];
        } catch (Exception $e) {

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(int $cartItemId, int $variantId, int $quantity)
    {
        try {

            $cartItem = $this->cartRepo->updateItemQuantity($cartItemId, $variantId, $quantity);

            if ($cartItem) {
                return [
                    'success' => true,
                    'message' => 'Cập nhập sản phẩm thành công'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Remove item from cart
     */
    public function removeCartItem(int $cartItemId)
    {
        try {

            $deletedItem = $this->cartRepo->deleteCartItems($cartItemId);

            if ($deletedItem) {
                return [
                    'success' => true,
                    'message' => 'Cập nhập sản phẩm thành công'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Clear entire cart
     */
    public function clear(?int $userId = null)
    {
        try {

            $cart = $this->getCart($userId);

            return [
                'success' => $cart->items()->delete() > 0,
                'message' => 'xóa giỏ hàng thành công'
            ];
        } catch (Exception $e) {

            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Merge guest cart to user cart on login
     */
    //     public function mergeGuestCartToUser(int $userId): Cart
    //     {
    //         $sessionId = Session::get('cart_session_id');
    // 
    //         // user khong có session id
    //         if (!$sessionId) {
    //             return $this->cartRepo->findUserCart($userId);
    //         }
    // 
    //         return DB::transaction(function () use ($userId, $sessionId) {
    //             // Get guest cart
    //             $guestCart = Cart::where('session_id', $sessionId)
    //                 ->whereNull('user_id')
    //                 ->with('items')
    //                 ->first();
    // 
    //             // If no guest cart, just return user cart
    //             if (!$guestCart || $guestCart->isEmpty()) {
    //                 if ($guestCart) {
    //                     $guestCart->delete();
    //                 }
    //                 return $this->getUserCart($userId);
    //             }
    // 
    //             // Get or create user cart
    //             $userCart = $this->getUserCart($userId);
    // 
    //             // Merge items
    //             foreach ($guestCart->items as $guestItem) {
    //                 $existingItem = CartItem::where('cart_id', $userCart->id)
    //                     ->where('product_id', $guestItem->product_id)
    //                     ->where('product_variant_id', $guestItem->product_variant_id)
    //                     ->first();
    // 
    //                 if ($existingItem) {
    //                     // Merge quantities
    //                     $existingItem->increaseQuantity($guestItem->quantity);
    //                 } else {
    //                     // Move item to user cart
    //                     $guestItem->update(['cart_id' => $userCart->id]);
    //                 }
    //             }
    // 
    //             // Delete guest cart
    //             $guestCart->delete();
    // 
    //             return $userCart->fresh('items');
    //         });
    //     }



    /**
     * Get cart summary
     */
    public function getCartSummary(?int $userId = null): array
    {
        $cart = $this->getCart($userId);
        $cart->load('items.product');

        return [
            'items' => $cart->items,
            'total_items' => $cart->getTotalItems(),
            'subtotal' => $cart->getSubtotal(),
            'is_empty' => $cart->isEmpty(),
        ];
    }

    /**
     * Get or create session ID
     */
    protected function getOrCreateSessionId(): string
    {
        if (!Session::has('cart_session_id')) {
            Session::put('cart_session_id', Str::uuid()->toString());
        }

        return Session::get('cart_session_id');
    }

    /**
     * Cleanup old guest carts (run via scheduled command)
     */
    public function cleanupOldGuestCarts(int $daysOld = 7): int
    {
        return Cart::whereNull('user_id')
            ->where('updated_at', '<', now()->subDays($daysOld))
            ->delete();
    }
}
