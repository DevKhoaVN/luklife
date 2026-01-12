<?php

namespace App\Http\Controllers\v1\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\orders;

class OrderController extends Controller
{
    // 1. Lấy danh sách đơn hàng
    public function index(Request $request)
    {
        $userId = $request->user() ? $request->user()->id : 1;

        $orders = orders::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    // 2. Xem chi tiết đơn hàng
    public function show(Request $request, $orderCode)
    {
        $userId = $request->user() ? $request->user()->id : 1;

        $order = orders::where('order_code', $orderCode)
            ->where('user_id', $userId)
            ->with(['items.variant.product'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng không tồn tại hoặc không thuộc về bạn.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
