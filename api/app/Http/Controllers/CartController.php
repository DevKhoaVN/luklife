<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CartService;

class CartController extends Controller
{

    public function __construct(protected CartService $cartService) {}

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'variant_id' => 'nullable|integer|exists:product_variants,id'
        ]);

        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');
        $variantId = $request->input('variant_id');
        $userId = $request->input('user_id');
        $result = $this->cartService->addItem($productId, $quantity, $variantId, $userId);

        return response()->json($result, $result['success'] ? 200 : 500);
    }
    public function getCart(Request $request)
    {
        // lay user id
        $userId = $request->input('user_id');
        $result = $this->cartService->getCart($userId);

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }

    public function updateQuantity(Request $request)
    {
        // lay data
        $cartItemId = $request->input('cartItemId');
        $variantId = $request->input('variantId');
        $quantity =  $request->input('quantity');

        // goi service
        $result = $this->cartService->updateQuantity($cartItemId, $variantId, $quantity);

        // ket qua
        return response()->json($result);
    }

    public function deleteCart(Request $request)
    {

        $cartId = $request->input('cart_id');
        // goi service
        $result = $this->cartService->clear($cartId);

        // ket qua
        return response()->json($result);
    }

    public function clearItemCart(Request $request)
    {
        $cartId = $request->input('cart_items_id');
        // $cartId = $request->input('');
        if (!$cartId) {
            return response()->json(['success' => false, 'message' => 'Vui lòng cung cấp cart_item_id'], 400);
        }
        // goi service
        $result = $this->cartService->clear($cartId);

        // ket qua
        return response()->json($result);
    }
}
