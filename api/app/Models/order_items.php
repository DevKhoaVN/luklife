<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class order_items extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'order_items';
    protected $fillable = [
        'order_id',
        'variant_id',
        'quantity',
        'unit_price',
        'item_discount',
        'sub_total',
        'created_at'
    ];
    public function order()
    {
        return $this->belongsTo(orders::class);
    }
    public function variant()
    {
        return $this->belongsTo(product_variants::class, 'variant_id');
    }
}
