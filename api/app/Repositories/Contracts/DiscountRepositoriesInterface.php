<?php
namespace App\Repositories\Contracts;

interface DiscountRepositoriesInterface
{
    public function all();
    public function paginate($perPage = 15);
    public function find($id);
    public function findByCode($code);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getValid();
    public function search($keyword);
}