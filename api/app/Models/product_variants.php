<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class product_variants extends Model
{
    use HasFactory;
    protected $table = 'product_variants';

    protected $fillable = [
        'product_id',
        'sku',
        'color',
        'size',
        'sale_price',
        'stock_quantity',
        'image_url',
        'weight',
        'is_active'
    ];
    public function product()
    {
        return $this->belongsTo(products::class, 'product_id', 'id');
    }
}
