<?php

use App\Http\Controllers\v1\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\Admin\CategoriesController;
use App\Http\Controllers\v1\Products\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\v1\Client\PaymentController;

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

    Route::get('/', [CartController::class, 'getCart']);
    Route::post('items', [CartController::class, 'addItem']);
    Route::put('items/{itemId}', [CartController::class, 'updateItem']);
    Route::delete('items/{itemId}', [CartController::class, 'deleteItem']);
    Route::delete('/', [CartController::class, 'clearCart']);
});

Route::post('/payment/vnpay', [PaymentController::class, 'createPaymentUrl']);
Route::get('/payment/vnpay-return', [PaymentController::class, 'vnpayReturn']);
