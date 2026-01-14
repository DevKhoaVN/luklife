<?php
namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Repositories\Contracts\CartRepositoriesInterface ;
use App\Repositories\Contracts\ProductRepositoriesInterface;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Exception;


class CartService {


    public function __construct(protected CartRepositoriesInterface $cartRepo, protected ProductRepositoriesInterface $productRepo){}
   
    public function getCart(int $userId )
    {
        try{

            $cart =  $this->cartRepo->findUserCart($userId);
            return [
                'success' => true,
                'message' => "Tìm kiếm giỏ hàng thành công.",
                'data' => $cart
            ];
        }catch(Exception $e){
            return [
                'success' => true,
                'message' =>$e->getMessage()
            ];
        }
        
       
    }

 
    public function addItem(int $cartId , int $quantity = 1, int $variantId , int $price = 0)
    {
        try {
   
                //1: tim kiếm cart
                if ($cartId) {
                    $cart = Cart::find($cartId);
                }

                // 2. Kiểm tra xem Item này đã tồn tại trong giỏ chưa
                $item = $cart->items()
                    ->where('variant_id', $variantId)
                    ->first();

                // 3. Xử lý logic Thêm/Cập nhật

                if ($item) {
                    // A. Cập nhật: Cộng dồn số lượng
                    // $item->price = $price; // Nếu bạn tin tưởng giá từ FE (Không khuyến khích)
                    $item->quantity += $quantity;

                } else {
                    // B. Tạo mới: Khởi tạo CartItem mới
                    $item = new CartItem([
                        'cart_id' => $cart->id,
                        'variant_id' => $variantId,
                        'quantity' => $quantity,
                        'price' => $price
                    ]);
                }

                // 4. Lưu và trả về phiên bản mới nhất
                $savedItem = $this->cartRepo->saveItem($item);

                return [
                    'success' => true,
                    'message' => "Thêm sản phẩm vào giỏ hàng thành công.",
                    'data' => $savedItem
                ];

            } catch (Exception $e){
                return [
                    'success' => false,
                    'message' => "Thêm sản phẩm vào giỏ hàng thất bại.",

                ];
            }
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(int $cartItemId,int $variantId, int $quantity, int $price)
    {
        try{

            $cartItem = $this->cartRepo->updateItemQuantity($cartItemId, $variantId, $quantity, $price);
        
           if($cartItem) {
                return [
                    'success' => true,
                    'message' => 'Cập nhập sản phẩm thành công'
                ];
           }

        }catch(Exception $e){
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Remove item from cart
     */
    public function deleteItemFromCart(int $cartId,int $variantId)
    {
       try {

        $deletedItem = $this->cartRepo->deleteItemFromCart($cartId, $variantId);

       if($deletedItem){
            return [
                'success' => true,
                'message' => 'xóa phẩm thành công'
            ];
       }

       }catch(Exception $e){
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
       }
    }
 

}