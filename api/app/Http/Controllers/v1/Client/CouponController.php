<?php

namespace App\Http\Controllers\v1\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;
use Carbon\Carbon;

class CouponController extends Controller
{
    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'order_total' => 'required|numeric|min:0'
        ]);
        $code = $request->code;
        $orderTotal = $request->order_total;
        $coupon = Coupon::where('code', $code)->first();
        //Kiểm tra 1
        if (!$coupon || !$coupon->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá không tồn tại hoặc không khả dụng.'
            ], 404);
        }
        // return response()->json([
        //     'success' => true,
        //     'message' => 'Đã tìm thấy mã giảm giá...'
        // ]);
        //Kiểm tra 2
        $now = Carbon::now();
        // Nếu mã có ngày bắt đầu và hiện tại chưa đến ngày đó -> Báo lỗi
        if ($coupon->starts_at && $now->lt($coupon->starts_at)) {
            return response()->json(['success' => false, 'message' => 'Mã giảm giá chưa đến đợt áp dụng.'], 400);
        }

        // Nếu mã có ngày hết hạn và hiện tại đã qua ngày đó -> Báo lỗi
        if ($coupon->expires_at && $now->gt($coupon->expires_at)) {
            return response()->json(['success' => false, 'message' => 'Mã giảm giá đã hết hạn.'], 400);
        }

        // Ví dụ: Mã chỉ cho 100 người dùng, mà used_count đã >= 100 -> Hết lượt
        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            return response()->json(['success' => false, 'message' => 'Mã giảm giá đã hết lượt sử dụng.'], 400);
        }
        if ($coupon->min_order_amount && $orderTotal < $coupon->min_order_amount) {
            return response()->json([
                'success' => true,
                'message' => 'Giá trị đơn hàng cần tối thiểu từ ' . number_format($coupon->min_order_amount) . '.'
            ], 400);
        }

        // Kiểm tra 3
        $discountAmount = 0;
        if ($coupon->type === 'fixed') {
            $discountAmount = $coupon->value;
        } else if ($coupon->type === 'percent') {
            $discountAmount = ($orderTotal * $coupon->value) / 100;
        }

        if ($discountAmount > $orderTotal) {
            $discountAmount = $orderTotal;
        }
        $finalTotal = $orderTotal - $discountAmount;
        return response()->json([
            'success' => true,
            'message' => 'Áp dụng Coupon thành công.',
            'data' => [
                'coupon_code' => $coupon->code,
                'coupon_id' => $coupon->id,
                'discount_amount' => $discountAmount,
                'final_total' => $finalTotal
            ]
        ]);
    }
}
