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
        $id = JWTAuth::parseToken()->authenticate()->id;
        $result = $this->userService->getAddresses($id);

        return response()->json($result);
    }

    /**
     * Create new address
     * POST /api/user/addresses
     */
    public function createAddress(CreateAddressRequest $request): JsonResponse
    {
        $id = JWTAuth::parseToken()->authenticate()->id;
        $result = $this->userService->createAddress($id, $request->validated());
     

        return response()->json($result);
    }

    /**
     * Update address
     * PUT /api/user/addresses/{id}
     */
    public function updateAddress(UpdateAddressRequest $request ): JsonResponse
    {
        $addressId = $request->route('id');
        $id = JWTAuth::parseToken()->authenticate()->id;
        $result = $this->userService->updateAddress($id, $addressId, $request->validated());


        return response()->json($result);
    }

    /**
     * Delete address
     * DELETE /api/user/addresses/{id}
     */
    public function deleteAddress(Request $request): JsonResponse
    {
        $addressId = $request->route('id');
        $id = JWTAuth::parseToken()->authenticate()->id;
        $result = $this->userService->deleteAddress($addressId, $id);

        return response()->json($result);
    }

    /**
     * Set address as default
     * PATCH /api/user/addresses/{id}/set-default
     */
    public function setAddressDefault(Request $request): JsonResponse
    {
        $addressId = $request->route('id');
       
        $id = JWTAuth::parseToken()->authenticate()->id;
  
        $result = $this->userService->setAddressDefault((int)$addressId, $id);

        return response()->json($result);
    }
    
    public function resetPassword(Request $request)
    {
        //
        $id = JWTAuth::parseToken()->authenticate()->id;
        $currentPassword = $request->input('current_password', '');  
        $newPassword     = $request->input('new_password', '');
        $result = $this->userService->resetPassword($id, $currentPassword, $newPassword);
        return response()->json($result);
    }

    public function getAllUsers(){
        $result = $this->userService->getAllUsers();
        return response()->json($result);
    }

    public function updatePasswordByAdmin(Request $request, $id){
        // 1. Lấy password mới từ request body
        $newPassword = $request->input('password');

        // 2. Kiểm tra dữ liệu (Validation)
        $request->validate([
            'password' => 'required|min:6',
        ]);
        $result = $this->userService->updatePasswordByAdmin($id, $newPassword);
        return response()->json($result);
    }

    public function deleteUser(Request $request, $id){
        
        $result = $this->userService->deleteUser($id);
        return response()->json($result);
    }
}
