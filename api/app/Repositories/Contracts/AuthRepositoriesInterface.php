<?php

namespace App\Repositories\Contracts;

interface AuthRepositoriesInterface
{
    public function login(array $data);
    public function register(array $data);
    public function forgotPassword(string $email);
    public function resetPassword(array $data);
    public function logout(int $userId);
    public function refreshToken(string $token);

    public function findUserByEmail(string $email);
    public function findUserById(int $id);
}
