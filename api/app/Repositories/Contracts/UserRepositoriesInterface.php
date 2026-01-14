<?php
namespace App\Repositories\Contracts;

interface UserRepositoriesInterface
{
    public function createUser(array $attributes, array $values);
    public function deleteUser(int $id);
    public function updateUser(int $id, array $data);
    public function findUserByEmail(string $email);
    public function findUserById(int $id);
   

}
