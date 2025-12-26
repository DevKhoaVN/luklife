<?php

namespace App\Repositories\Iml;

use App\Repositories\Contracts\UserRepositoriesInterface;
use App\Models\users;

 class UserRepository implements UserRepositoriesInterface {
    protected $user;

    public function __construct(users $user)
    {
      $this->user = $user;
    }
    
    public function createUser(array $data){
      return $this->user->create($data);
    }

    public function deleteUser(array $data){

    }

    public function updateUser(string $email){

    }
}