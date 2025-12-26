<?php

namespace App\Repositories\Iml;

use App\Models\token_blacklist as Token;
use App\Repositories\Contracts\TokenRepositoriesInterface;

class TokenRepositories implements TokenRepositoriesInterface
{
    protected Token $token;

    public function __construct(Token $token)
    {
        $this->token = $token;
    }

    // implement methods
    public function createToken(array $where, array $values){
        return $this->token::updateOrCreate( $where,  $values);
    }
    public function deleteToken(string $token){
        $this->token->where('token', $token)->delete();
    }
    public function findToken(string $token){
        return $this->token->where('token', $token)->first();
    }
}
