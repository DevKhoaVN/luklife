<?php
// app/Http/Middleware/CheckRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckRole
{
    /**
     * Handle an incoming request.
     * 
     * @param string|array $roles Có thể truyền 1 role hoặc nhiều roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        try {
            // Lấy user từ JWT token
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            if (empty($roles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No roles specified'
                ], 403);
            }

            // Kiểm tra user có ít nhất 1 trong các roles được chỉ định
            $hasRole = $user->hasRole($roles);

            if (!$hasRole) {
                return response()->json([
                    'success' => false,
                    'message' => 'Forbidden. Required role: ' . implode(' or ', $roles)
                ], 403);
            }

            return $next($request);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }
    }
}
