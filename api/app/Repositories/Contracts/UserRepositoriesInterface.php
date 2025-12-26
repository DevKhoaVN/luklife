<?php
namespace App\Repositories\Contracts;

interface UserRepositoriesInterface
{
    public function createUser(array $data);
    public function deleteUser(array $data);
    public function updateUser(string $email);

}
