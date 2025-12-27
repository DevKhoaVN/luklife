<?php
namespace App\Repositories\Contracts;

interface UserRepositoriesInterface
{
    public function createUser(array $attributes, array $values);
    public function deleteUser(array $data);
    public function updateUser(string $email);
    public function findUserByEmail(string $email);
    public function findUserById(int $id);
   

}
