<?php

namespace App\Repositories\Contracts;

use App\Models\cart as Cart;
use App\Models\cart_items as CartItem;
use Illuminate\Database\Eloquent\Collection;

interface CartRepositoriesInterface {

    public function findUserCart(int $userId): ?Cart;

    public function findGuestCart(string $sessionId): ?Cart;

    public function saveItem(CartItem $item): CartItem;

    public function deleteCartItems(int $cartItemId): bool;


    public function updateItemQuantity(int $cartId, int $variantId, int $quantity): bool;

    public function findExistingItem(int $cartId, int $productId, ?string $variantId): ?CartItem;
}