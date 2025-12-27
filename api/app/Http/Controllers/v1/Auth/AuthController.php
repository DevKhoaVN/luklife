<?php 
namespace App\Http\Controllers\v1\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

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
        return response()->json(['message' => 'Password has been reset']);
    }

    public function logout(Request $request){
        // Logout logic here
        return response()->json(['message' => 'Logout successful']);
    }

    public function refresh(Request $request){
        // Token refresh logic here
        return response()->json(['message' => 'Token refreshed']);
    }


}