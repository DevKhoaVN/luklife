<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class orders extends Model
{
    use HasFactory;

    protected $table = 'orders'; // Map vào bảng orders trong database

    protected $fillable = [
        'order_code',
        'user_id',
        'shipping_address_id',
        'recipient_name',
        'recipient_phone',
        'shipping_address',
        'total_amount',
        'discount_amount',
        'coupon_code',
        'shipping_fee',
        'grand_total',
        'order_status',
        'payment_status',
        'payment_method',
        'notes',
        'cancelled_reason'
    ];

    // Khai báo kiểu dữ liệu cho các cột status (Optional - giúp code sạch hơn)
    protected $casts = [
        'total_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(order_items::class, 'order_id', 'id');
    }
}
