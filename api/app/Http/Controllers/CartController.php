<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartItemRequest;
use Illuminate\Http\Request;
use App\Services\CartService;
class CartController extends Controller
{

    public function __construct(protected CartService $cartService){}

    public function getCart(Request $request){
        // lay user id
        $userId = $request->input('user_id');
        $result = $this->cartService->getCart($userId);

        return response()->json( $result);
    }

    public function addToCart(StoreCartItemRequest $request)
    {
           $cartId = $request->input('cart_id');
           $variantId = $request->input('variant_id');
           $quantity = $request->input('quantity');
           $price = $request->input('price');

           $result = $this->cartService->addItem($cartId, $quantity,$variantId, $price);
           return response()->json( $result);
    }

    public function updateQuantity(Request $request){
        // lay data
      $cartItemId = $request->input('cart_id');
      $variantId = $request->input('variant_id');
      $quantity =  $request->input('quantity');
      $price =  $request->input('price');


    // goi service
     $result = $this->cartService->updateQuantity($cartItemId, $variantId, $quantity, $price);

     // ket qua
     return response()->json($result);
    }

    public function deleteItemFromCart(Request $request){

        $cartId = $request->input('cart_id');
        $variantId = $request->input('variant_id');
        // goi service
        $result = $this->cartService->deleteItemFromCart($cartId, $variantId);

        // ket qua
        return response()->json($result);
    }

}

