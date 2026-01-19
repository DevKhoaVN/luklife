<?php

namespace App\Http\Middleware;

use App\Models\Users;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission)
    {
      try{
        dd($permission);
            $payload = JWTAuth::parseToken()->getPayload();

            // kiem tra user co ton tai khogn
            if (!$payload) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn'], 401);
            }

            //kiem tra quyen cua user

            $userId = $payload->get('user_id');

            $user = Users::with('roles.permissions')->find($userId);

            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại'], 404);
            }

            if (!$user->hasPermissionTo($permission)) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Bạn không có quyền: [$permission]"
                ], 403);
            }

            $request->attributes->add(['auth_user' => $user]);


            return $next($request);

      }catch(Exception $e){
            return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn'], 401);
      }
    }
}
