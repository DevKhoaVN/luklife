<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class products extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'thumbnail',
        'name',
        'slug',
        'price',
        'discount_percentage',
        'description',
        'is_active',
        'is_featured',
    ];
    public function variants()
    {
        return $this->hasMany(product_variants::class, 'product_id', 'id');
    }

    public function categories()
    {
        return $this->belongsToMany(categories::class, 'product_categories', 'product_id', 'category_id');
    }
}
