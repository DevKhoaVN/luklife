<?php

namespace App\Repositories\Contracts;

interface TokenRepositoriesInterface
{
    public function createToken(array $where, array $values);
    public function deleteToken(string $token);
    public function findToken(string $token);

}
