<?php

use App\Http\Controllers\v1\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\Admin\CategoriesController ;
use App\Http\Controllers\v1\Products\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\v1\Auth\UserController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});


Route::middleware('auth:api', 'can')->group(function () {

    // Auth protected
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']); // profile
    });

    // User routes
});

Route::prefix('category')->group(function () {
    Route::post('index', [CategoriesController::class, 'index']);
    Route::post('store', [CategoriesController::class, 'store']);
    Route::post('update', [CategoriesController::class, 'update']);
    Route::post('delete', [CategoriesController::class, 'destroy']);
});

Route::prefix('products')->group(function () {
    Route::get('', [ProductController::class, 'index']);
    Route::put('{product}', [ProductController::class, 'update']);
    Route::get('{slug}', [ProductController::class, 'detail']);
    Route::post('create', [ProductController::class, 'create']);
    Route::delete('{id}', [ProductController::class, 'delete']);
});


Route::prefix('cart')->group(function () {

    Route::post('/', [CartController::class, 'getCart']);
    Route::post('items', [CartController::class, 'addToCart']);
    Route::put('/', [CartController::class, 'updateQuantity']);
    Route::post('delete', [CartController::class, 'deleteItemFromCart']);

});
Route::prefix('user')->group(function () {

    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/address', [UserController::class, 'getAddresses']);
    Route::post('/address/create', [UserController::class, 'createAddress']);
    Route::put('/address', [UserController::class, 'deleteItemFromCart']);
    Route::post('/address/delete', [UserController::class, 'deleteItemFromCart']);
    Route::put('/address/isDefault', [UserController::class, 'deleteItemFromCart']);
});
