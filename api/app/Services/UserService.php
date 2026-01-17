<?php

namespace App\Services;

use App\Repositories\Contracts\AddressRepositoriesInterface;
use App\Repositories\Contracts\UserRepositoriesInterface;
use Cloudinary\Cloudinary;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
class UserService
{
    private $cloudinary;
    public function __construct(
        protected UserRepositoriesInterface $userRepo,
        protected AddressRepositoriesInterface $addressRepo
    ) {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key' => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
            ]
        ]);
    }

    public function getProfile(int $userId)
    {
      
       try{
            if (!$userId) {
                throw new Exception('userId required');
            }

            $result =  $this->userRepo->findUserById($userId);
            return [
                'sccuess' => true,
                'message' => "Lấy profile thành công",
                'data' => $result
            ];
       }catch(Exception $e){
            return [
                'sccuess' => true,
                'message' => $e->getMessage()

            ];
       }
    }

    public function updateProfile(int $userId, array $data)
    {
        DB::beginTransaction();

        try {
            // 1. Lấy thông tin user
            $user = $this->userRepo->findUserById($userId);

            if (!$user) {
                throw new Exception('User not found');
            }

            // 2. Xử lý upload avatar nếu có
            if (isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
                $file = $data['avatar'];

                // Validate file
                $this->validateImage($file);

                Log::info('Uploading avatar to Cloudinary', [
                    'user_id' => $userId,
                    'filename' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                ]);

                try {
                    // Upload lên Cloudinary với $this->cloudinary
                    $uploadResult = $this->cloudinary->uploadApi()->upload(
                        $file->getRealPath(),
                        [
                            'folder' => 'avatars',
                            'resource_type' => 'image',
                            'overwrite' => true,
                        ]
                    );

                    Log::info('Avatar uploaded successfully', [
                        'user_id' => $userId,
                        'public_id' => $uploadResult['public_id'],
                        'url' => $uploadResult['secure_url'],
                    ]);

                    // Xóa ảnh cũ trên Cloudinary (nếu có)
                    if (!empty($user->avatar_public_id)) {
                        try {
                            $this->cloudinary->uploadApi()->destroy($user->avatar_public_id);

                            Log::info('Old avatar deleted', [
                                'public_id' => $user->avatar_public_id
                            ]);
                        } catch (Exception $deleteError) {
                            Log::warning('Failed to delete old avatar', [
                                'public_id' => $user->avatar_public_id,
                                'error' => $deleteError->getMessage()
                            ]);
                        }
                    }

                    // Cập nhật data
                    $data['avatar'] = $uploadResult['secure_url'];
                    $data['avatar_public_id'] = $uploadResult['public_id'];
                } catch (Exception $cloudinaryError) {
                    Log::error('Cloudinary upload failed', [
                        'user_id' => $userId,
                        'error' => $cloudinaryError->getMessage(),
                        'trace' => $cloudinaryError->getTraceAsString(),
                    ]);

                    throw new Exception('Failed to upload avatar: ' . $cloudinaryError->getMessage());
                }
            }

            // 3. Loại bỏ giá trị null/empty
            $updateData = array_filter($data, function ($value) {
                return !is_null($value) && $value !== '';
            });

            // 4. Update user
            $result = $this->userRepo->updateUser($userId, $updateData);

            // 5. Refresh data
            if ($result) {
                $result = $this->userRepo->findUserById($userId);
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Cập nhật profile thành công",
                'data' => $result
            ];
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Update profile failed', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate uploaded image
     */
    private function validateImage(UploadedFile $file)
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error: ' . $file->getErrorMessage());
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new Exception('Invalid file type. Only JPEG, PNG, JPG, GIF, WEBP allowed.');
        }

        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file->getSize() > $maxSize) {
            throw new Exception('File size must be less than 5MB. Current: ' . round($file->getSize() / 1024 / 1024, 2) . 'MB');
        }

        return true;
    }

    /**
     * Get all addresses for a user
     */
    public function getAddresses(int $userId)
    {
    try {
        $result =  $this->addressRepo->getAllByUserId($userId);
        return [
            'sccuess' => true,
            'message' => "Lấy profile thành công",
            'data' => $result
        ];
    } catch (Exception $e) {
        return [
            'sccuess' => true,
            'message' => $e->getMessage()

        ];
    }
    }

    /**
     * Create new address
     */
    public function createAddress(int $userId, array $data)
    {
        try{
            return DB::transaction(function () use ($userId, $data) {
                $data['user_id'] = $userId;

                // If this is set as default, unset other defaults
                if (isset($data['is_default']) && $data['is_default']) {
                    $this->addressRepo->unsetAllDefaults($userId);
                }

                // If this is the first address, make it default
                if ($this->addressRepo->countByUserId($userId) === 0) {
                    $data['is_default'] = true;
                }

                $result =  $this->addressRepo->create($data);
                return [
                    'success' => true,
                    'message' => "Thêm địa chỉ thành công",
                    'data' => $result
                ];
            });
        }catch(Exception $e){
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
        
    }

    /**
     * Update existing address
     */
    public function updateAddress(int $userId, int $addressId, array $data): array
    {
        try {
            return DB::transaction(function () use ( $userId, $addressId, $data) {
                $address = $this->addressRepo->findAddressByUserId($userId);

                if (!$address) {
                    throw new Exception("Địa chỉ không tồn tại hoặc không thuộc về người dùng này");
                }

                // If setting this as default, unset other defaults
                if (isset($data['is_default']) && $data['is_default']) {
                    $this->addressRepo->unsetAllDefaults($userId);
                }

                $updatedAddress = $this->addressRepo->update($addressId, $data);

                return [
                    'success' => true,
                    'message' => "Cập nhật địa chỉ thành công",
                    'data' => $updatedAddress
                ];
            });
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete address
     */
    public function deleteAddress(int $addressId, int $userId): array
    {
        try {
            return DB::transaction(function () use ($addressId, $userId) {
                $address = $this->addressRepo->findAddressByUserId($addressId, $userId);

                if (!$address) {
                    throw new Exception("Địa chỉ không tồn tại hoặc không thuộc về người dùng này");
                }

                // Kiểm tra số lượng địa chỉ (optional - tùy business logic)
                $totalAddresses = $this->addressRepo->countByUserId($userId);
                if ($totalAddresses === 1) {
                    throw new Exception("Không thể xóa địa chỉ duy nhất");
                }

                $wasDefault = $address->is_default;
                $this->addressRepo->delete($addressId);

                // If deleted address was default, set another address as default
                if ($wasDefault) {
                    $newDefault = $this->addressRepo->getFirstByUserId($userId);

                    if ($newDefault) {
                        $this->addressRepo->setAsDefault($newDefault->id);
                    }
                }

                return [
                    'success' => true,
                    'message' => "Xóa địa chỉ thành công"
                ];
            });
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Set address as default
     */
    public function setAddressDefault(int $addressId, int $userId): array
    {
        try {
            return DB::transaction(function () use ($addressId, $userId) {
                $address = $this->addressRepo->findByIdAndUserId($addressId, $userId);

                if (!$address) {
                    throw new Exception("Địa chỉ không tồn tại hoặc không thuộc về người dùng này");
                }

                // Kiểm tra xem đã là default chưa
                if ($address->is_default) {
                    return [
                        'success' => true,
                        'message' => "Địa chỉ này đã là địa chỉ mặc định",
                        'data' => $address
                    ];
                }

                // Unset all other default addresses
                $this->addressRepo->unsetAllDefaults($userId);

                // Set this address as default
                $this->addressRepo->setAsDefault($addressId);

                $updatedAddress = $this->addressRepo->findAddressByUserId($addressId, $userId);

                return [
                    'success' => true,
                    'message' => "Đặt địa chỉ mặc định thành công",
                    'data' => $updatedAddress
                ];
            });
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function resetPassword(int $userId, string $currentPassword, string $newPassword)
    {
        try {
         

            if (empty($currentPassword) || empty($newPassword)) {
                throw new Exception("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới");
            }

            // 1. Lấy user
            $user = $this->userRepo->findUserById($userId);
            if (!$user) {
                throw new Exception("Người dùng không tồn tại");
            }
           
            // 2. Kiểm tra mật khẩu hiện tại có đúng không
            if (!password_verify((string)$currentPassword, $user->password)) {
                // Hoặc dùng: if (!Hash::check($currentPassword, $user->password))
                throw new Exception("Mật khẩu hiện tại không đúng");
            }

            // 3. Không cho phép mật khẩu mới trùng mật khẩu cũ
            if (Hash::check($newPassword, $user->password)) {
                throw new Exception("Mật khẩu mới không được giống mật khẩu cũ");
            }

            // 4. Hash mật khẩu mới bằng cách chuẩn của Laravel
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);

            // 5. Cập nhật
            $this->userRepo->updatePassword($userId,$hashedPassword);

            return [
                'success' => true,
                'message' => 'Đổi mật khẩu thành công'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage() // Trả về thông báo cụ thể hơn
            ];
        }
    }

    public function countUsers(){
        try{
            $count = $this->userRepo->countUsers();
            return $count;
        }catch(Exception $e){
            return 0;
        }
    }
}
