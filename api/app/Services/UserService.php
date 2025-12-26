<?php
namespace App\Services;

use App\Repositories\Contracts\UserRepositoriesInterface;


class UserService {

    protected $userRepo;

    public function __construct(UserRepositoriesInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }
    public function createUser(array $data){
        return $this->userRepo->createUser($data);
    }
}