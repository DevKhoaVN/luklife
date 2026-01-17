<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\ProductVariant;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Product extends Model
{
    use HasSlug;

    protected $table = 'products';

    protected $fillable = [
        'thumbnail',
        'name',
        'price',
        'discount_percentage',
        'slug',
        'description',
        'is_active',
        'is_featured'
    ];

    protected $casts = [
        'id' => 'integer',
        'price' => 'decimal:2',
        'discount_percentage' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    // auto create slug
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')  // ← Bỏ dấu ngoặc thừa
            ->preventOverwrite();
    }

    // ✅ SỬA: product_variants -> productVariants (hoặc ngược lại)
    // Tên method phải khớp với tên được gọi trong query
    public function productVariants()  // ← Đổi tên từ product_variants
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    // Giữ lại cả 2 để backward compatibility (tùy chọn)
    public function product_variants()
    {
        return $this->productVariants();
    }

    // Many-to-many với Category
    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'productcategories',
            'product_id',
            'category_id'
        );
    }

    public function getOriginalPriceAttribute(): ?float
    {
        if ($this->discount_percentage == 0) {
            return null;
        }

        return round($this->price / (1 - $this->discount_percentage / 100), 0);
    }
}
