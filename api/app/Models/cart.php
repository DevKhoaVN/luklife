<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cart extends Model
{
    protected $table = 'carts';
    protected $fillable = [
        'user_id',
        'session_id'
    ];

    public function items()
    {
        return $this->hasMany(cart_items::class, 'cart_id');
    }

    public function users()
    {
        return $this->beLongsto(users::class, 'user_id');
    }
}
