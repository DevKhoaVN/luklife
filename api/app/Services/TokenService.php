<?php

namespace App\Services;

use App\Models\users as User;
use App\Models\RefreshToken;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Repositories\Contracts\TokenRepositoriesInterface;
use Illuminate\Support\Facades\Hash;

use Exception;
use Illuminate\Http\Request;

class TokenService
{
    protected TokenRepositoriesInterface $tokenRepo;
    private int $accessTtlSeconds = 3600;        // 1h
    private int $refreshTtlSeconds = 604800;     // 7d

    public function __construct(TokenRepositoriesInterface $tokenRepo)
    {
        $this->tokenRepo = $tokenRepo;
    }

    public function generateToken(User $user, array $extraClaims = []): string
    {
        $claims = array_merge([
            'user_id' => $user->id,
        ], $extraClaims);

        return JWTAuth::customClaims($claims)->fromUser($user);
    }

    public function createKeyToken(User $user,Request $request): array
    {
       try {
            $now = now();

            $accessToken = $this->generateToken($user, [
                'type' => 'access',
                'exp'  => $now->copy()->addSeconds($this->accessTtlSeconds)->timestamp,
            ]);

            $refreshToken = $this->generateToken($user, [
                'type' => 'refresh',
                'exp'  => $now->copy()->addSeconds($this->refreshTtlSeconds)->timestamp,
            ]);

        // Lưu refresh token (hash) để revoke/rotate
        $this->tokenRepo->createToken(
            [
            'user_id' => $user->id
            ], 

            [
                [
                    'user_id'    => $user->id,
                    'token_hash' => Hash::make($refreshToken),
                    'token_type' => 'refresh',
                    'expires_at' => now()->addDays(7),
                    'revoked_at' => null,
                    'reason'     => null,
                    'ip_address' => $request->ip() ?? null,
                    'user_agent' => $request->userAgent() ?? null,
                ]
           ]);

            return [
                'access_token'  => $accessToken,
                'refresh_token' => $refreshToken,
                'token_type'    => 'Bearer',
                'expires_in'    => $this->accessTtlSeconds,
            ];

       }catch(Exception $e){
            throw new Exception('Error generating tokens: ' . $e->getMessage());
       }
    }

    // Validate refresh token và rotate (cấp cặp token mới, revoke refresh cũ)
//     public function rotateRefreshToken(string $refreshToken, array $deviceInfo = []): array
//     {
//         // 1) Verify token signature/exp và lấy payload
//         $payload = JWTAuth::setToken($refreshToken)->getPayload();
// 
//         if (($payload['type'] ?? null) !== 'refresh') {
//             throw new \Exception('Invalid token type');
//         }
// 
//         $userId = (int) ($payload['user_id'] ?? 0);
//         $jti    = (string) ($payload['jti'] ?? '');
// 
//         // 2) Tìm refresh token trong DB, kiểm revoked/expired
//         $record = RefreshToken::query()
//             ->where('user_id', $userId)
//             ->where('jti', $jti)
//             ->whereNull('revoked_at')
//             ->first();
// 
//         if (! $record || $record->expires_at->isPast()) {
//             abort(401, 'Refresh token revoked or expired');
//         }
// 
//         // 3) Compare hash (chống DB leak)
//         if (! Hash::check($refreshToken, $record->token_hash)) {
//             // Token reuse / bị giả mạo => revoke luôn token này (tuỳ policy)
//             $record->update(['revoked_at' => now()]);
//             abort(401, 'Invalid refresh token');
//         }
// 
//         // 4) Revoke refresh token cũ (rotation)
//         $record->update(['revoked_at' => now()]);
// 
//         // 5) Cấp cặp token mới
//         $user = User::findOrFail($userId);
//         return $this->createKeyToken($user, $deviceId);
//     }
// 
//     // Logout: revoke refresh token (DB) + (tuỳ chọn) blacklist access token hiện tại
//     public function revokeRefreshToken(string $refreshToken): void
//     {
//         $payload = JWTAuth::setToken($refreshToken)->getPayload();
//         $jti = (string) ($payload['jti'] ?? '');
//         $userId = (int) ($payload['user_id'] ?? 0);
// 
//        
//     }

    // Chỉ dùng nếu bạn bật blacklist trong jwt-auth (nếu không sẽ throw)
    public function invalidateToken(string $token): void
    {
        JWTAuth::setToken($token)->invalidate();
    }
}
