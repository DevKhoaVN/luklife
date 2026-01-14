<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class user_addresses extends Model
{
    use HasFactory;
    protected $table = 'addresses';
    protected $guarded = [];
}
