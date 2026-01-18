<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductVariant;
use App\Models\Orders;

class OrderItems extends Model
{
    protected $table = 'orderitems';

    public $timestamps = false; // Vì bảng chỉ có created_at

    protected $fillable = [
        'order_id',
        'variant_id',
        'quantity',
        'unit_price',
        'item_discount',
        'sub_total',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'item_discount' => 'decimal:2',
        'sub_total' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function order()
    {
        return $this->belongsTo(Orders::class, 'order_id');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
