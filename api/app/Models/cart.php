<?php

namespace App\Models;

use App\Models\cart_items as CartItem;
use App\Models\users as User;
use Illuminate\Database\Eloquent\Model;

class cart extends Model
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
        return $this->belongsTo(User::class);
    }
}
