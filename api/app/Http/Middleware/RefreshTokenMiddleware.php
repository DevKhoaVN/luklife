<?php

namespace App\Http\Middleware;

use App\Repositories\Contracts\TokenRepositoriesInterface;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RefreshTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * 
     */

    protected TokenRepositoriesInterface $tokenRepo;

    public function __construct(TokenRepositoriesInterface $tokenRepo)
    {
        $this->tokenRepo = $tokenRepo;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {

            return response()->json([
                'sccuess' => false,
                'message' => 'Unauthenticated'], 401);
        }

        $hashed = hash('sha256', $refreshToken);

        $token =$this->tokenRepo->findToken($hashed);

        if (!$token || $token->expires_at < now()) {
            return response()->json(['message' => 'Invalid refresh token'], 401)
                ->withoutCookie('refresh_token');
        }

        // 🔥 Attach vào request
        $request->attributes->set('refresh_token_id', $token->id);
        $request->attributes->set('user_id', $token->user_id);

        return $next($request);
        return $next($request);
    }
}
