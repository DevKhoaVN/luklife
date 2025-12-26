<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class token_blacklist extends Model
{
    //
    protected $table = 'token_blacklists';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'token_hash',
        'token_type',
        'expires_at',
        'revoked_at',
        'reason',
        'ip_address',
        'user_agent'
    ];
}
