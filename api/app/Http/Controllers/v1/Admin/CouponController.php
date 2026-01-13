<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;

class CouponController extends Controller
{
    public function index()
    {
        // Lấy danh sách, sắp xếp mới nhất lên đầu, phân trang 10 cái/trang
        $coupons = Coupon::orderBy('id', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $coupons
        ]);
    }

    // 2. Tạo mã giảm giá mới
    public function store(Request $request)
    {
        // Validate dữ liệu đầu vào (Rất quan trọng)
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code', // Bắt buộc, không trùng lặp
            'type' => 'required|in:fixed,percent',           // Chỉ được chọn 'fixed' hoặc 'percent'
            'value' => 'required|numeric|min:0',             // Phải là số dương
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at', // Ngày hết hạn phải sau ngày bắt đầu
        ]);

        // Tạo mới
        $coupon = Coupon::create([
            'code' => strtoupper($request->code), // Tự động viết hoa mã (ví dụ: tet2025 -> TET2025)
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount ?? 0,
            'max_uses' => $request->max_uses,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo mã giảm giá thành công!',
            'data' => $coupon
        ], 201);
    }

    // 3. Xóa mã giảm giá
    public function destroy($id)
    {
        $coupon = Coupon::find($id);
        if (!$coupon) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy mã'], 404);
        }

        $coupon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa mã giảm giá thành công'
        ]);
    }
}
