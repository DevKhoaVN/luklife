<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Users;
use App\Models\OrderItems;
use App\Models\Transactions;
use App\Models\Discount;
use App\Models\UserAddresses;
class Orders extends Model
{
    // protected $table = 'orders';

    protected $fillable = [
        'order_code',
        'user_id',
        'shipping_address_id',
        'discount_id',
        'discount_code',
        'recipient_name',
        'recipient_phone',
        'shipping_address',
        'total_amount',
        'discount_amount',
        'shipping_fee',
        'grand_total',
        'order_status',
        'payment_status',
        'payment_method',
        'vnpay_txn_ref',
        'paid_at',
        'notes',
        'cancelled_reason',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'paid_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(Users::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'order_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transactions::class, 'order_id');
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class, 'discount_id');
    }

    public function shippingAddress()
    {
        return $this->belongsTo(UserAddresses::class, 'shipping_address_id');
    }
}
