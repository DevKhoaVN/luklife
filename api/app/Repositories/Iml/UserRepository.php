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

    public function createUser(array $attributes, array $values){
      return $this->user->updateOrCreate($attributes, $values);
    }

    public function deleteUser(array $data){

    }

    public function updateUser(string $email){

    }
    public function findUserByEmail(string $email)
    {
        return $this->user->where('email', $email)->first();
    }
     
}