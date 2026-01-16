<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\products;

class ProductImage extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id',
        'image_url',
        'position',
        'is_thumbnail'
    ];
    public function products()
    {
        return $this->belongsTo(products::class);
    }
}
