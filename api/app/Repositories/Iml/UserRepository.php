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
  public function deleteUser(int $id)
  {
    $user = $this->user->findOrFail($id);

    // Soft delete bằng cách set is_active = false
    return $user->update(['is_active' => 0]);
  }

  public function updatePassword(int $id, string $newPassword)
  {
    // Tìm user theo ID, nếu không thấy sẽ văng ngoại lệ ModelNotFoundException (404)
    $user = $this->user->find($id);

    if (!$user) {
      return false;
    }

    // Thực hiện update và trả về kết quả (true/false)
    return $user->update([
      'password' => password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12])
    ]);
  }
  public function updateUser(int $id, array $data)
  {
    $user = $this->user->findOrFail($id);

    if (isset($data['password'])) {
      $data['password'] = Hash::make($data['password']);
    }

    $user->update($data);  

    return $user;
  }


  public function findUserByEmail(string $email)
    {
        return $this->user->where('email', $email)->first();
    }
    public function findUserById(int $id)
    {
        return $this->user->where('id', $id)->first();
    }
    public function countUsers(){
        return $this->user->where('is_active', true)->count();
    }
     
    public function getAllUsers()
    {
      return $this->user->where('is_active', true)->paginate(10);
    }

   
}