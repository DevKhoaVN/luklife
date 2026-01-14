<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Sluggable\HasSlug;
use App\Models\Product;

class Category extends Model
{
    //
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'trending',
        'parent_id',
        'level',
        'is_active',
    ];

    protected $casts = [
        'trending' => 'boolean',
        'is_active' => 'boolean',
    ];

    // auto create slug
    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
                  ->generateSlugsFrom('name')
                  ->saveSlugsTo(('slug'))
                  ->doNotGenerateSlugsOnUpdate();
                                    
    }

    //Relation
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function descendants()
    {
        return $this->children()->with('descendants');
    }

    // Many-to-many với Product
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_categories', 'category_id', 'product_id');
    }

}
