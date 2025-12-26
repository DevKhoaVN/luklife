<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class users extends Authenticatable implements JWTSubject
{
    protected $table = 'users';
    
    protected $fillable = [
        'full_name',
        'phone',
        'gender',
        'email',
        'date_of_birth',
        'password',
    ];

    protected $hidden = ['password'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
