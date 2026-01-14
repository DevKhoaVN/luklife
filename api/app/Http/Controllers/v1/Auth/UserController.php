<?php

namespace App\Http\Controllers\v1\Auth;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\CreateAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    /**
     * Get user profile
     * GET /api/user/profile
     */
    public function getProfile(Request $request): JsonResponse
    {
        $id = JWTAuth::parseToken()->authenticate()->id;
        $result = $this->userService->getProfile($id);
        

        return response()->json($result);
    }

    /**
     * Update user profile
     * PUT /api/user/profile
        */
        public function updateProfile(Request $request)
        {

            $id = JWTAuth::parseToken()->authenticate()->id;
            $result = $this->userService->updateProfile($id, $request->all());
        
            return response()->json($result);
        }

    /**
     * Get all user addresses
     * GET /api/user/addresses
     */
    public function getAddresses(): JsonResponse
    {
        $result = $this->userService->getAddresses(auth()->id());
        $status = $result['success'] ? 200 : 404;

        return response()->json($result, $status);
    }

    /**
     * Create new address
     * POST /api/user/addresses
     */
    public function createAddress(CreateAddressRequest $request): JsonResponse
    {
        $result = $this->userService->createAddress(auth()->id(), $request->validated());
        $status = $result['success'] ? 201 : 422;

        return response()->json($result, $status);
    }

    /**
     * Update address
     * PUT /api/user/addresses/{id}
     */
    public function updateAddress(UpdateAddressRequest $request, int $id): JsonResponse
    {
        $result = $this->userService->updateAddress($id, auth()->id(), $request->validated());
        $status = $result['success'] ? 200 : 422;

        return response()->json($result, $status);
    }

    /**
     * Delete address
     * DELETE /api/user/addresses/{id}
     */
    public function deleteAddress(int $id): JsonResponse
    {
        $result = $this->userService->deleteAddress($id, auth()->id());
        $status = $result['success'] ? 200 : 422;

        return response()->json($result, $status);
    }

    /**
     * Set address as default
     * PATCH /api/user/addresses/{id}/set-default
     */
    public function setAddressDefault(int $id): JsonResponse
    {
        $result = $this->userService->setAddressDefault($id, auth()->id());
        $status = $result['success'] ? 200 : 422;

        return response()->json($result, $status);
    }
}
