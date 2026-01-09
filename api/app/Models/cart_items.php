<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cart_items extends Model
{
    protected $table = 'cart_items';
    protected $fillable = [
        'cart_id',
        'variant_id',
        'quantity'
    ];
    public function cart()
    {
        return $this->beLongsto(cart::class, 'cart_id');
    }
    public function variant()
    {
        return $this->beLongsto(product_variants::class, 'variant_id');
    }
}
