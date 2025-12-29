<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\categories as Category;
class products extends Model
{
    //
    protected $fillable = ['thumbnail', 'name', 'slug', 'description', 'is_active', 'is_featured'];

    // Many-to-many với Category
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }
    public function getOriginalPriceAttribute(): ?float
    {
        if ($this->discount_percentage == 0) {
            return null; // không có giảm giá
        }

        return round($this->price / (1 - $this->discount_percentage / 100), 0);
    }
}
