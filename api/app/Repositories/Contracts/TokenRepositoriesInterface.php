<?php

namespace App\Repositories\Contracts;

interface TokenRepositoriesInterface
{
    public function createToken(array $where, array $values);
    public function deleteTokensByUserId(int $userId);
    public function findToken(string $token);
    public function findTokenByUserId(int $userId);

}
