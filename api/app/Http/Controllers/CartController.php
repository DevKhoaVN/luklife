<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CartService;
class CartController extends Controller
{

    public function __construct(protected CartService $cartService){}

    public function getCart(Request $request){
        // lay user id
        $userId = $request->input('user_id');
        $result = $this->cartService->getCart($userId);

        return response()->json($request);
    }

    public function updateQuantity(Request $request){
        // lay data
      $cartItemId = $request->input('cartItemId');
      $variantId = $request->input('variantId');
      $quantity =  $request->input('quantity');

    // goi service
     $result = $this->cartService->updateQuantity($cartItemId, $variantId, $quantity);

     // ket qua
     return response()->json($result);
    }

    public function deleteCart(Request $request){

        $cartId = $request->input('cart_id');
        // goi service
        $result = $this->cartService->clear($cartId);

        // ket qua
        return response()->json($result);
    }

    public function clearItemCart(Request $request){
        $cartId = $request->input('cart_items_id');
        $cartId = $request->input('');
        // goi service
        $result = $this->cartService->clear($cartId);

        // ket qua
        return response()->json($result);
    }
}

