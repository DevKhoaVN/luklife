<?php 
namespace App\Http\Controllers\v1\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller{
    public function login(Request $request){
        // Login logic here
           return response()->json(['message' => 'Login successful']);
    }
}