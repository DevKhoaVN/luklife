<?php

namespace App\Repositories\Contracts;


interface OrderRepositoriesInterface
{

   public function getOrderById(string $orderId);
    public function countRevenue();
    
    public function countOrders();
    public function getByOrderStatus(string $status, int $perPage = 10);
  
    public function findByUserId(int $userId, int $perPage = 10);

    public function all(string $status, int $perPage = 10);
    /**
     * Create a new order
     */
    public function create(int $userId, array $data);

    /**
     * Find order by ID
     */
    public function findById(int $orderId);

    /**
     * Update order
     */
    public function update(string $orderId, array $data);

    /**
     * Delete order
     */
    public function delete(int $orderId): bool;
}