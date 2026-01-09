<?php

namespace App\Http\Controllers\v1\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddToCartRequest;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function addToCart(AddToCartRequest $request)
    {
        // 1. Lấy thông tin User
        // Nếu đã login -> có user_id. Nếu chưa -> null.
        $user = auth('api')->user(); // Hoặc $request->user() tùy cách cấu hình auth
        $userId = $user ? $user->id : null;

        // 2. Lấy Session ID (cho khách vãng lai)
        // Nếu client gửi session_id lên thì dùng, không thì tạo mới
        $sessionId = $request->header('X-Session-ID') ?? Str::uuid()->toString();

        // 3. Gọi Service
        $result = $this->cartService->addToCart($request->validated(), $userId, $sessionId);

        $statusCode = $result['success'] ? 200 : 400;

        // Trả về kèm header Session-ID để client lưu lại dùng cho lần sau
        return response()->json($result, $statusCode)
            ->header('X-Session-ID', $sessionId);
    }
}
