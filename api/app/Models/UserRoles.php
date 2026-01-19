<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRoles extends Model
{
    //
    protected $table = "user_roles";
    
    protected $fillable = [
        'user_id',
        'role_id',
        'assigned_at'	
    ];


    //relationship
}
