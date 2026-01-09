<?php

use App\Http\Controllers\v1\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\Admin\CategoriesController;
use App\Http\Controllers\v1\Products\ProductController;
use App\Http\Controllers\v1\Client\CartController;

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
    Route::get('/', [CategoriesController::class, 'index']);
    Route::post('/', [CategoriesController::class, 'store']);
    Route::put('update/{id}', [CategoriesController::class, 'update']);
    Route::delete('delete/{id}', [CategoriesController::class, 'destroy']);
});
Route::prefix('products')->group(function () {
    Route::get('index', [ProductController::class, 'index']);
    Route::post('store', [ProductController::class, 'store']);
    Route::put('update/{id}', [ProductController::class, 'update']);
    Route::delete('delete/{id}', [ProductController::class, 'destroy']);
});

Route::prefix('cart')->group(function () {
    Route::post('/add', [CartController::class, 'addToCart']);
});
