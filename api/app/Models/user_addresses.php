<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\AddressFactory;

class user_addresses extends Model
{
    use HasFactory;
    protected $table = 'addresses';
    protected $guarded = [];
    protected function newFactory()
    {
        return AddressFactory::new();
    }
}
