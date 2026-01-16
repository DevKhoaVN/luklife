<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\categories as Category;
use App\Models\product_variants as ProductVariant;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\ProductFactory;
use App\Models\ProductImage;

class products extends Model
{
    use HasSlug, HasFactory;

    protected $table = 'products';
    //
    protected $fillable = ['thumbnail', 'name', 'price', 'discount_percentage', 'slug', 'description', 'is_active', 'is_featured'];


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
            ->saveSlugsTo(('slug'))
            ->preventOverwrite();
    }

    public function product_variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }
    // Many-to-many với Category
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories', 'product_id', 'category_id');
    }
    public function getOriginalPriceAttribute(): ?float
    {
        if ($this->discount_percentage == 0) {
            return null; // không có giảm giá
        }

        return round($this->price / (1 - $this->discount_percentage / 100), 0);
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('position', 'asc');
    }

    protected static function newFactory()
    {
        return ProductFactory::new();
    }
}
