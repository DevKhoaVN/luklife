<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coupon extends Model
{
    use HasFactory;
    protected $fillable = [
        'code',             // Mã code (VD: TET2025)
        'type',             // Loại: 'fixed' (tiền) hoặc 'percent' (%)
        'value',            // Giá trị giảm
        'min_order_amount', // Giá trị đơn tối thiểu
        'max_uses',         // Số lượt dùng tối đa
        'used_count',       // Đã dùng bao nhiêu lần
        'starts_at',        // Ngày bắt đầu
        'expires_at',       // Ngày hết hạn
        'is_active',        // Trạng thái kích hoạt
    ];
    //Ép kiểu dữ liệu
    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}
