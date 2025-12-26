<?php
namespace App\Services;

use App\Repositories\Contracts\AuthRepositoriesInterface;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Cache;

class AuthService
{
    protected AuthRepositoriesInterface $authRepo;
    protected UserService $userService;
    protected TokenService $tokenService;

    public function __construct(AuthRepositoriesInterface $authRepositories, UserService $userService, TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
        $this->authRepo = $authRepositories;
        $this->userService = $userService;
    }

    /**
     * Đăng nhập user và trả về JWT token
     */
    public function login(array $data, Request $request)
    {
        try {

            // Tìm user theo email
            $user = $this->authRepo->findUserByEmail($data['email']);

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
                'user' => [
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
     * Đăng ký user mới
     */
    public function register(array $data, Request $request)
    {
        try {
   
            if ($this->authRepo->findUserByEmail($data['email'])) {
                throw new Exception('Email đã được sử dụng');
            }

            // Hash password
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);

            // Tạo user mới
             $user = $this->userService->createUser($data);

            if (!$user) {
                throw new Exception('Không thể tạo tài khoản. Vui lòng thử lại.');
            }
            // generate token activation
            $token = $this->tokenService->createKeyToken($user, $request); 

            return [
                'success' => true,
                'message' => 'Đăng ký tài khoảnthành công.',
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
//     public function forgotPassword(string $email)
//     {
//         try {
// 
//             // check email account exits
//             $user = $this->authRepo->findUserByEmail($email);
//             if(!$user){
//                 throw new Exception('Email không tồn tại trong hệ thống.');
//             }
//             
//             $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
// 
//             Cache::put("reset:otp:{$email}", $otp, now()->addMinute(2));
// 
//             return [
//                 'success' => true,
//                 'message' => 'Nếu email tồn tại, link reset mật khẩu đã được gửi.',
//             ];
//         } catch (Exception $e) {
//             return [
//                 'success' => false,
//                 'message' => 'Có lỗi xảy ra. Vui lòng thử lại.',
//             ];
//         }
//     }

    /**
     * Reset mật khẩu với token
     */
//     public function resetPassword(array $data)
//     {
//         try {
//             // Validate
//             if (empty($data['token']) || empty($data['password'])) {
//                 throw new Exception('Token và mật khẩu mới không được để trống');
//             }
// 
//             if (strlen($data['password']) < 8) {
//                 throw new Exception('Mật khẩu phải có ít nhất 8 ký tự');
//             }
// 
//             if (
//                 isset($data['password_confirmation']) &&
//                 $data['password'] !== $data['password_confirmation']
//             ) {
//                 throw new Exception('Mật khẩu xác nhận không khớp');
//             }
// 
//             // Tìm user theo reset token
//             $user = $this->authRepo->findByResetToken($data['token']);
// 
//             if (!$user) {
//                 throw new Exception('Token không hợp lệ hoặc đã hết hạn');
//             }
// 
//             // Kiểm tra token expiry
//             if (strtotime($user->reset_token_expiry) < time()) {
//                 throw new Exception('Token đã hết hạn. Vui lòng yêu cầu reset lại.');
//             }
// 
//             // Hash password mới
//             $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);
// 
//             // Cập nhật password và xóa reset token
//             $this->authRepo->updatePassword($user->id, $hashedPassword);
//             $this->authRepo->clearPasswordResetToken($user->id);
// 
//             // Xóa tất cả refresh tokens cũ (force logout khỏi tất cả devices)
//             $this->authRepo->revokeAllRefreshTokens($user->id);
// 
//             return [
//                 'success' => true,
//                 'message' => 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.',
//             ];
//         } catch (Exception $e) {
//             return [
//                 'success' => false,
//                 'message' => $e->getMessage(),
//             ];
//         }
//     }

    /**
     * Đăng xuất user
     */
//     public function logout(int $userId)
//     {
//         try {
//             // Xóa refresh token của user (có thể xóa token cụ thể hoặc tất cả)
//             $this->authRepo->revokeRefreshToken($userId);
// 
//             return [
//                 'success' => true,
//                 'message' => 'Đăng xuất thành công',
//             ];
//         } catch (Exception $e) {
//             return [
//                 'success' => false,
//                 'message' => 'Có lỗi xảy ra khi đăng xuất',
//             ];
//         }
//     }

    /**
     * Làm mới access token bằng refresh token
     */
//     public function refreshToken(string $token)
//     {
//         try {
//             // Decode refresh token
//             $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
// 
//             // Kiểm tra token type
//             if (!isset($decoded->type) || $decoded->type !== 'refresh') {
//                 throw new Exception('Token không hợp lệ');
//             }
// 
//             // Kiểm tra refresh token có tồn tại trong DB không
//             $isValid = $this->authRepo->validateRefreshToken($decoded->user_id, $token);
// 
//             if (!$isValid) {
//                 throw new Exception('Refresh token không hợp lệ hoặc đã bị thu hồi');
//             }
// 
//             // Lấy thông tin user
//             $user = $this->authRepo->findById($decoded->user_id);
// 
//             if (!$user) {
//                 throw new Exception('User không tồn tại');
//             }
// 
//             // Tạo access token mới
//             $newAccessToken = $this->generateAccessToken($user);
// 
//             return [
//                 'success' => true,
//                 'access_token' => $newAccessToken,
//                 'token_type' => 'Bearer',
//                 'expires_in' => $this->jwtExpiry,
//             ];
//         } catch (Exception $e) {
//             return [
//                 'success' => false,
//                 'message' => 'Refresh token không hợp lệ hoặc đã hết hạn',
//             ];
//         }
//     }

    /**
     * Tạo JWT access token
     */
//     private function generateAccessToken($user): string
//     {
//         $payload = [
//             'iat' => time(),
//             'exp' => time() + $this->jwtExpiry,
//             'type' => 'access',
//             'user_id' => $user->id,
//             'email' => $user->email,
//         ];
// 
//         return JWT::encode($payload, $this->jwtSecret, 'HS256');
//     }

    /**
     * Tạo JWT refresh token
     */
//     private function generateRefreshToken($user): string
//     {
//         $payload = [
//             'iat' => time(),
//             'exp' => time() + $this->refreshTokenExpiry,
//             'type' => 'refresh',
//             'user_id' => $user->id,
//         ];
// 
//         return JWT::encode($payload, $this->jwtSecret, 'HS256');
//     }

    /**
     * Validate dữ liệu đăng ký
     */
//     private function validateRegistrationData(array $data): void
//     {
//         if (empty($data['email'])) {
//             throw new Exception('Email không được để trống');
//         }
// 
//         if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
//             throw new Exception('Email không hợp lệ');
//         }
// 
//         if (empty($data['password'])) {
//             throw new Exception('Mật khẩu không được để trống');
//         }
// 
//         if (strlen($data['password']) < 8) {
//             throw new Exception('Mật khẩu phải có ít nhất 8 ký tự');
//         }
// 
//         if (
//             isset($data['password_confirmation']) &&
//             $data['password'] !== $data['password_confirmation']
//         ) {
//             throw new Exception('Mật khẩu xác nhận không khớp');
//         }
//     }

    /**
     * Gửi email reset password
     */
//     private function sendPasswordResetEmail(string $email, string $resetLink, string $name): void
//     {
//         // Implement với PHPMailer hoặc mail service của bạn
//         $subject = 'Reset mật khẩu';
//         $message = "
//             <h2>Xin chào {$name},</h2>
//             <p>Bạn đã yêu cầu reset mật khẩu. Click vào link dưới đây:</p>
//             <a href='{$resetLink}'>Reset mật khẩu</a>
//             <p>Link này sẽ hết hạn sau 1 giờ.</p>
//             <p>Nếu bạn không yêu cầu reset, vui lòng bỏ qua email này.</p>
//         ";
// 
//         // Gửi email (implement với PHPMailer hoặc service khác)
//         // mail($email, $subject, $message, $headers);
//     }
}
