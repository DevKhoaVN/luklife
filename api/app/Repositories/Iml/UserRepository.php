<?php

namespace App\Repositories\Iml;

use App\Repositories\Contracts\UserRepositoriesInterface;
use App\Models\Users;
use Illuminate\Support\Facades\Hash;

 class UserRepository implements UserRepositoriesInterface {
    protected Users $user;

    public function __construct(Users $user)
    {
      $this->user = $user;
    }

    public function createUser(array $attributes, array $values){
      return $this->user->updateOrCreate($attributes, $values);
    }

    public function getActiveUsers()
    {
        return $this->user
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }
  public function deleteUser(int $id): bool
  {
    $user = $this->user->findOrFail($id);

    // Soft delete bằng cách set is_active = false
    return $user->update(['is_active' => false]);
  }

  public function updatePassword(int $id, string $newPassword): bool
  {
    $user = $this->user->findOrFail($id);

    // Hash password và update
    return $user->update([
      'password' => $newPassword
    ]);
  }
  public function updateUser(int $id, array $data){

    $user = $this->user->findOrFail($id);

    // Hash password if provided
    if (isset($data['password'])) {
      $data['password'] = Hash::make($data['password']);
    }

    // Chỉ update những field được truyền vào $data
    // và nằm trong $fillable của model
    $user->update($data);

    return $user->fresh();
    }
    public function findUserByEmail(string $email)
    {
        return $this->user->where('email', $email)->first();
    }
    public function findUserById(int $id)
    {
        return $this->user->where('id', $id)->first();
    }
     
}