<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class token_blacklist extends Model
{
    use HasFactory;
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
