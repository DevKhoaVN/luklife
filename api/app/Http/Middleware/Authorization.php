<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\JWTException;

class Authorization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $accessToken = substr($authHeader, 7);

        try {
            // Verify + decode token
            $payload = JWTAuth::setToken($accessToken)->getPayload();

        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'code' => 'ACCESS_TOKEN_EXPIRED',
                'message' => 'Access token expired !'
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid access token'
            ], 401);
        }
      
        // attach user_id
        $request->attributes->set('user_id', $payload['sub']);


        return $next($request);
    }
}
