<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\product_variants as ProductVariant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\products as Product;

class cart_items extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'cart_id',
        'product_id',
        'variant_id',
        'quantity',
        'price',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id', 'id');
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id', 'id');
    }
}
