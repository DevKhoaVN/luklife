<?php 
namespace App\Http\Controllers\v1\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller{

    protected  $authService;

    public function __construct(AuthService $authService){
        $this->authService = $authService;
    }

    public function login(LoginRequest $request){
        // check data input
        $validData = $request->validated();

        $result = $this->authService->login($validData, $request);
        
        return response()->json($result)->cookie('refresh_token', $result['token']['refresh_token'] ?? '', 60 * 24 * 30, null, null, false, true);
    }

    public function register(RegisterRequest $request){
        ///check  data input
        $validData = $request->validated();

        $result = $this->authService->register($validData, $request);
        return response() ->json($result)->cookie('refresh_token', $result['token']['refresh_token'] ?? '', 60 * 24 * 30, null, null, false, true);;
    }

    public function forgotPassword(Request $request){
        // Forgot password logic here
        $email = $request->input('email');

        $result = $this->authService->forgotPassword($email);

        return response()->json($result);
    }

    public function verifyOtp(Request $request){

        $result = $this->authService->verifyOtp($request->all());

        return response()->json($result);
    }
    public function resetPassword(Request $request){
        // Reset password logic here
        $result = $this->authService->resetPassword($request->all(), $request);
        return response()->json($result);
    }

    public function logout(Request $request){

        $id = JWTAuth::parseToken()->authenticate()->id;

        $result = $this->authService->logout((int)$id);
        return response()->json($result)->withCookie(Cookie::forget('refresh_token'));
    }

    public function refresh(Request $request)
    {
        // 1. Lấy refresh token từ cookie
        $refreshToken = $request->cookie('refresh_token');

        // 2. Gọi Service xử lý
        $result = $this->authService->refreshToken($refreshToken, $request);

        // 3. Kiểm tra kết quả trả về từ Service
        if (!$result['success']) {
            // Nếu lỗi, trả về 401 Unauthorized và xóa cookie cũ
            return response()->json($result, 401)->withoutCookie('refresh_token');
        }

        // 4. Nếu thành công, trả về Token mới và Set Cookie mới
        // Access token trả về trong body, Refresh token nằm trong HttpOnly Cookie
        $cookie = cookie(
            'refresh_token',
            $result['data']['refresh_token'],
            60 * 24 * 30, // 30 ngày
            null,
            null,
            true, // Secure (HTTPS only - nên để true trên prod)
            true  // HttpOnly
        );

        return response()->json([
            'success' => true,
            'token' => [
                'access_token' => $result['data']['access_token'],
                'expires_in' => $result['data']['expires_in']
            ]
        ])->withCookie($cookie);
    }


}