<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

use App\Models\CartItem;

class ProductVariant extends Model
{

    protected $table = 'productvariant';
    //
    protected $fillable = [
        'product_id',       // bắt buộc phải có, vì variant thuộc về product
        'sku',
        'image_url',
        'color',
        'size',
        'sale_price',
        'stock_quantity',
        'weight',           // đơn vị gram, bạn có thể comment để rõ nghĩa
        'is_active',

    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'variant_id',);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'variant_id');
    }
}
