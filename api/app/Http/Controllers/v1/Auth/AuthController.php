<?php 
namespace App\Http\Controllers\v1\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

        $user_id =  $request->attributes->get('user_id');

        $result = $this->authService->logout((int)$user_id);
        return response()->json($result)->withoutCookie('refresh_token');
    }

    public function refresh(Request $request){
        // Token refresh logic here
        $reuslt = $this->authService->refresh($request);
        return response()->json($reuslt)->cookie('refresh_token', $result['token']['refresh_token'] ?? '', 60 * 24 * 30, null, null, false, true);
    }


}