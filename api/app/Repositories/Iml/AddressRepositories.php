<?php

namespace App\Repositories\Iml;

use App\Repositories\Contracts\AddressRepositoriesInterface;
use App\Models\UserAddresses ;
use Illuminate\Database\Eloquent\Collection;

class AddressRepositories implements AddressRepositoriesInterface
{
    public function __construct(protected UserAddresses $model) {}

    /**
     * Get all addresses for a user
     */
    public function getAllByUserId(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Find address by ID and user ID
     */
    public function findAddressByUserId(int $userId): ?UserAddresses
    {
        return $this->model
            ->where('user_id', $userId)
            ->first();
    }

    public function findByIdAndUserId(int $addressId, int $userId): ?UserAddresses
    {
        return $this->model
            ->where('id', $addressId)
            ->where('user_id', $userId)
            ->first();
    }
    /**
     * Create new address
     */
    public function create(array $data): UserAddresses
    {
        return $this->model->create($data);
    }

    /**
     * Update address
     */
    public function update(int $addressId, array $data): UserAddresses
    {
        $address = $this->model->findOrFail($addressId);
        $address->update($data);
        return $address->fresh();
    }

    /**
     * Delete address
     */
    public function delete(int $addressId): bool
    {
        $address = $this->model->findOrFail($addressId);
        return $address->delete();
    }

    /**
     * Get default address for user
     */
    public function getDefaultAddress(int $userId): ?UserAddresses
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_default', true)
            ->first();
    }

    /**
     * Unset all default addresses for user
     */
    public function unsetAllDefaults(int $userId): int
    {
        return $this->model
            ->where('user_id', $userId)
            ->update(['is_default' => false]);
    }

    /**
     * Set address as default
     */
    public function setAsDefault(int $addressId): bool
    {
        $address = $this->model->findOrFail($addressId);
        return $address->update(['is_default' => true]);
    }

    /**
     * Count addresses for user
     */
    public function countByUserId(int $userId): int
    {
        return $this->model
            ->where('user_id', $userId)
            ->count();
    }

    /**
     * Get first address for user
     */
    public function getFirstByUserId(int $userId): ?UserAddresses
    {
        return $this->model
            ->where('user_id', $userId)
            ->first();
    }
}
