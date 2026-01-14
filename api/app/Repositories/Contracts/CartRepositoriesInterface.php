<?php

namespace App\Repositories\Contracts;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Database\Eloquent\Collection;

interface CartRepositoriesInterface {

    public function findUserCart(int $userId): ?Cart;


    public function saveItem(CartItem $item): CartItem;

    public function deleteItemFromCart(int $cartId, $variantId): bool;

    public function updateItemQuantity(int $cartId, int $variantId, int $quantity, int $price): bool;

    public function findExistingItem(int $cartId, int $productId, ?string $variantId): ?CartItem;
}