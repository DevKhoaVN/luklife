<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    //
    protected $table = "roles";
    
    protected $fillable = [
        'name',
        'description',
        'is_active'
    ];


    public function users()
    {
        return $this->belongsToMany(Users::class, 'user_roles', 'role_id', 'user_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permissions::class, 'role_permissions', 'role_id', 'permission_id');
    }
}
