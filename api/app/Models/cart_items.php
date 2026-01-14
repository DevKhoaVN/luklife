<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\product_variants as ProductVariant;

class cart_items extends Model
{
    protected $fillable = [
        'id',
        'cart_id',
        'variant_id',
        'quantity',
        'price',
    ];

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }
}
