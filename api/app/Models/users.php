<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Cart;

class Users extends Authenticatable implements JWTSubject
{
    protected $table = 'users';
    
    protected $fillable = [
        'full_name',
        'phone',
        'gender',
        'email',
        'date_of_birth',
        'password',
        'avatar',
        'is_active'
    ];

    protected $hidden = ['password'];

    public function addresses()
    {
        return $this->hasMany(UserAddresses::class);  
    }
    public function cart(){
        return $this->hasOne(Cart::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
