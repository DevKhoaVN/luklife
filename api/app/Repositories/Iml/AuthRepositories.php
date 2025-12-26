<?php

namespace App\Repositories\Iml;

use App\Models\users;
use App\Repositories\Contracts\AuthRepositoriesInterface;

class AuthRepositories implements AuthRepositoriesInterface
{
    protected users $users;

    public function __construct(users $user)
    {
        $this->users = $user;
    }

    // implement methods
    public function login(array $data){

    }

    public function register(array $data)
    {
       
    }

    public function forgotPassword(string $email)
    {
        
    }
    public function resetPassword(array $data)
    {
        
    }
    public function logout(int $userId)
    {
        
    }
    public function refreshToken(string $token)
    {
        
    }
    public function findUserByEmail(string $email)
    {
        return $this->users->where('email', $email)->first();
    }
    public function findUserById(int $id)
    {
         return ;
    }

}
