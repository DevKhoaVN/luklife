<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\products as Product;

use App\Models\cart_items as CartItem;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class product_variants extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id',
        'sku',
        'image_url',
        'color',
        'size',
        'sale_price',
        'stock_quantity',
        'weight',
        'is_active',

    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'variant_id',);
    }
}
