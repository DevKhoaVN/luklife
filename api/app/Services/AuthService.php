<?php
namespace App\Services;

use App\Mail\ResetPasswordOtpMail;
use App\Repositories\Contracts\AuthRepositoriesInterface;
use App\Repositories\Contracts\UserRepositoriesInterface;
use App\Repositories\Iml\UserRepository;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class AuthService
{
    protected UserRepositoriesInterface $userRepo;
    protected TokenService $tokenService;

    public function __construct(UserRepositoriesInterface  $userRepo, TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
        $this->userRepo = $userRepo;
    }

    /**
     * Đăng nhập user và trả về JWT token
     */
    public function login(array $data, Request $request)
    {
        try {

            // Tìm user theo email
            $user = $this->userRepo->findUserByEmail($data['email']);
           

            if (!$user) {
                throw new Exception('Email hoặc mật khẩu không đúng');
            }

            // Kiểm tra password
            if (!password_verify($data['password'], $user->password)) {
                throw new Exception('Email hoặc mật khẩu không đúng');
            }

            // Kiểm tra account đã kích hoạt chưa
               if (isset($user->is_active) && !$user->is_active) {
                throw new Exception('Tài khoản chưa được kích hoạt');
            }

         
            // Tạo JWT token
            $token = $this->tokenService->createKeyToken($user, $request);
    
            return [
                'success' => true,
                'message' => "Đăng nhập thành công",
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'full_name' => $user->full_name ?? null,
                    'gender' => $user->gender ?? null,
                    'date_of_birth' => $user->date_of_birth ?? null,
                    'phone' => $user->phone ?? null,
                    'avatar' => $user->avatar ?? null
                    

                ],
                'token' => $token
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Đăng ký user mới
     */
    public function register(array $data, Request $request)
    {
        try {
   
            if ($this->userRepo->findUserByEmail($data['email'])) {
                throw new Exception('Email đã được sử dụng');
            }

            // Hash password
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);

            // Tạo user mới
             $user = $this->userRepo->createUser(
                ['email' => $data['email']],
                [
                    'full_name' => $data['full_name'] ?? null,
                    'email' => $data['email'],
                    'password' => $data['password'],
                   
                ]);

            if (!$user) {
                throw new Exception('Không thể tạo tài khoản. Vui lòng thử lại.');
            }
            // generate token activation
            $token = $this->tokenService->createKeyToken($user, $request); 

            return [
                'success' => true,
                'message' => 'Đăng ký tài khoản thành công.',
                'user' =>  [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->full_name ?? null,
                ],
                'token' => $token
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Xử lý quên mật khẩu - gửi email reset
     */
    public function forgotPassword(string $email)
    {
        try {

            if( empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Email không hợp lệ.');
            }
            // check email account exits
            $user = $this->userRepo->findUserByEmail($email);
            if(!$user){
                throw new Exception('Email không tồn tại trong hệ thống.');
            }
            
            $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            Cache::put("reset:otp:{$email}", $otp, now()->addMinute(2));

            // Gửi mail QUA QUEUE (chay background nha)
            Mail::to($email)->queue(new ResetPasswordOtpMail($otp));
            return [
                'success' => true,
                'message' => 'Gửi email thành công, vui lòng kiểm tra email của bạn',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }


    /**
     * Xử lý otp reset password
     */

    public function verifyOtp(array $data)
    {
        try {
            if (empty($data['email']) || empty($data['otp'])) {
                throw new Exception('Email và OTP không được để trống');
            }

            // Lấy OTP từ cache
            $cachedOtp = Cache::get("reset:otp:{$data['email']}");

            if (!$cachedOtp || $cachedOtp !== $data['otp']) {
                throw new Exception('OTP không hợp lệ hoặc đã hết hạn');
            }

            // Xóa OTP khỏi cache sau khi xác thực thành công
            Cache::forget("reset:otp:{$data['email']}");

            return [
                'success' => true,
                'message' => 'Xác thực OTP thành công. Bạn có thể đặt lại mật khẩu mới.',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    /**
     * Reset mật khẩu với token
     */
    public function resetPassword(array $data, Request $request)
    {
        try {
            // Validate
            if (empty($data['password']) || strlen($data['password']) < 8) {
                throw new Exception('Mật khẩu mới không được để trống và phải có ít nhất 8 ký tự');
            }
            if (
                isset($data['password_confirmation']) &&
                $data['password'] !== $data['password_confirmation']
            ) {
                throw new Exception('Mật khẩu xác nhận không khớp');
            }

            // Tìm user theo email
            $user = $this->userService->findUserByEmail($data['email']);

            if (!$user) {
                throw new Exception('Email không tồn tại trong hệ thống.');
            }

            // Hash password mới
            $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);

            // Cập nhật password va tra ve token
            $this->userService->createUser(
                ['email' => $data['email']],
                ['password' => $hashedPassword]
            );

            return [
                'success' => true,
                'message' => 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Đăng xuất user
     */
    public function logout(int $userId)
    {
        try {
            // Xóa refresh token của user (có thể xóa token cụ thể hoặc tất cả)
            $deleted = $this->tokenService->revokeRefreshToken($userId);

            if(!$deleted){
                return [
                    'success' => false,
                    'message' => 'Xảy ra lỗi khi xóa token',
                ];
            }
            return [
                'success' => true,
                'message' => 'Đăng xuất thành công',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra khi đăng xuất' . $e->getMessage(),
            ];
        }
    }

    public function refreshToken(?string $refreshToken, Request $request): array
    {
        // 1. Validate Input
        if (empty($refreshToken)) {
            return [
                'success' => false,
                'message' => 'Refresh token không được để trống'
            ];
        }

        try {
            // 2. Hash token để tìm trong DB
            $tokenHash = hash('sha256', $refreshToken);

            // 3. Tìm Token trong DB
            $tokenRecord = $this->tokenService->findToken($tokenHash);

            // 4. Validate Token (Tồn tại? Hash khớp? Hết hạn?)
            if (
                !$tokenRecord ||
                !hash_equals($tokenRecord->token_hash, $tokenHash) ||
                $tokenRecord->expires_at < now()
            ) {
                return [
                    'success' => false,
                    'message' => 'Refresh token không hợp lệ hoặc đã hết hạn'
                ];
            }

            // 5. Lấy User
            $user = $this->userRepo->findUserById($tokenRecord->user_id);
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'User không tồn tại'
                ];
            }

            // 6. Tạo cặp Token mới (Access + Refresh)
            // Giả sử hàm createKeyToken trả về mảng ['access_token' => '...', 'refresh_token' => '...', 'expires_in' => ...]
            $newTokens = $this->tokenService->createKeyToken($user, $request);

            // 7. (Optional) Thu hồi token cũ để tránh dùng lại (Token Rotation)
            // $this->tokenService->revokeToken($tokenRecord->id);

            return [
                'success' => true,
                'data' => $newTokens
            ];
        } catch (Exception $e) {
           

            return [
                'success' => false,
                'message' => 'Lỗi hệ thống khi làm mới token'
            ];
        }
    }
}
