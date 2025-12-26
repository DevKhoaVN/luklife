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
        
        return response()->json($result);
    }

    public function register(RegisterRequest $request){
        ///check  data input
        $validData = $request->validated();

        $result = $this->authService->register($validData, $request);
        return response() ->json($result);
    }

    public function forgotPassword(Request $request){
        // Forgot password logic here
        return response()->json(['message' => 'Password reset link sent']);
    }

    public function resetPassword(Request $request){
        // Reset password logic here
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