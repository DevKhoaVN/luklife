<?php
namespace App\Services;

use App\Repositories\Contracts\UserRepositoriesInterface;


class UserService {

    protected $userRepo;

    public function __construct(UserRepositoriesInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }
    public function createUser(array $attributes, array $values){
        return $this->userRepo->createUser($attributes, $values);
    }
    public function findUserByEmail(string $email)
    {
        return $this->userRepo->findUserByEmail($email);
    }
    public function findUserById(int $id)
    {
        return $this->userRepo->findUserById($id);
    }
}