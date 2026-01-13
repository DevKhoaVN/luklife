<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\orders;

class OrderController extends Controller
{
    // 1. Lấy danh sách tất cả đơn hàng (Có phân trang & Lọc)
    public function index(Request $request)
    {
        $query = orders::query();

        // Lọc theo trạng thái đơn hàng (nếu có gửi lên)
        // Ví dụ: ?status=pending
        if ($request->has('status')) {
            $query->where('order_status', $request->status);
        }

        // Lọc theo mã đơn hàng (Tìm kiếm)
        if ($request->has('keyword')) {
            $query->where('order_code', 'like', '%' . $request->keyword . '%');
        }

        // Sắp xếp đơn mới nhất lên đầu
        $data = $query->orderBy('created_at', 'desc')
            ->with(['items']) // Load sơ bộ danh sách món
            ->paginate(10); // Phân trang, mỗi trang 10 đơn

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    // 2. Xem chi tiết 1 đơn (Admin cần xem kỹ hơn Client)
    public function show($id)
    {
        // Admin xem theo ID hoặc order_code đều được
        $order = orders::with(['items.variant.product', 'items.variant'])
            ->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    // 3. Cập nhật trạng thái đơn hàng (Quan trọng nhất)
    public function updateStatus(Request $request, $id)
    {
        $order = orders::find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn'], 404);
        }

        // Validate dữ liệu gửi lên
        $request->validate([
            'order_status' => 'required|in:pending,processing,shipping,completed,cancelled',
            'payment_status' => 'nullable|in:pending,paid,failed'
        ]);

        // Cập nhật
        $order->order_status = $request->order_status;

        // Nếu có gửi payment_status thì cập nhật luôn (ví dụ khách trả tiền mặt khi nhận hàng)
        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công!',
            'data' => $order
        ]);
    }
}
