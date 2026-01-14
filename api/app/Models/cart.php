<?php

namespace App\Models;

use App\Models\CartItem;
use App\Models\Users;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //
    protected $fillable = [
        'id',
        'user_id',
        'session_id'
    ];

    public function items(){
        return $this->hasMany(CartItem::class );
    }
    public function user(){
        return $this->belongsTo(Users::class);
    }
}
