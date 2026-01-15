<?php

namespace App\Repositories\Contracts;
use App\Models\UserAddresses;
use Illuminate\Database\Eloquent\Collection;

interface AddressRepositoriesInterface
{
    /**
     * Get all addresses for a user
     */
    public function getAllByUserId(int $userId): Collection;

    /**
     * Find address by ID and user ID
     */
    public function findAddressByUserId(int $userId): ?UserAddresses;

    public function findByIdAndUserId(int $addressId, int $userId): ?UserAddresses;

    /**
     * Create new address
     */
    public function create(array $data): UserAddresses;

    /**
     * Update address
     */
    public function update(int $addressId, array $data): UserAddresses;

    /**
     * Delete address
     */
    public function delete(int $addressId): bool;

    /**
     * Get default address for user
     */
    public function getDefaultAddress(int $userId): ?UserAddresses;

    /**
     * Unset all default addresses for user
     */
    public function unsetAllDefaults(int $userId): int;

    /**
     * Set address as default
     */
    public function setAsDefault(int $addressId): bool;

    /**
     * Count addresses for user
     */
    public function countByUserId(int $userId): int;

    /**
     * Get first address for user
     */
    public function getFirstByUserId(int $userId): ?UserAddresses;
}
