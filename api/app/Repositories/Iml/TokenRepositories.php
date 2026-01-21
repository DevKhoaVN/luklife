<?php

namespace App\Repositories\Iml;

use App\Models\TokenBlacklist;
use App\Repositories\Contracts\TokenRepositoriesInterface;

class TokenRepositories implements TokenRepositoriesInterface
{
    protected TokenBlacklist $token;

    public function __construct(TokenBlacklist $token)
    {
        $this->token = $token;
    }

    // implement methods
    public function createToken(array $where, array $values){
        return $this->token::updateOrCreate( $where,  $values);
    }
    public function deleteTokensByUserId(int $userId)
    {
        return $this->token
            ->where('user_id', $userId)
            ->delete();
    }
    public function findToken(string $token){
        
        return $this->token->where('token_hash', $token)
            ->where('token_type', 'refresh')
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();
    }
    public function findTokenByUserId(int $userId){
        return $this->token->where('user_id', $userId)->first();
    }
}
