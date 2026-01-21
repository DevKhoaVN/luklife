<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\v1\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\Admin\CategoriesController ;
use App\Http\Controllers\v1\Products\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\v1\Admin\AdminController;
use App\Http\Controllers\v1\Admin\DiscountController;
use App\Http\Controllers\v1\Auth\UserController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});


Route::prefix('auth')->group(function () {
    Route::post('refresh', [AuthController::class, 'refresh']);
});
Route::middleware('auth:api', 'can')->group(function () {
    // Auth protected
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::prefix('category')->group(function () {
    Route::post('index', [CategoriesController::class, 'index']);
    // 2. Nhóm các hành động quản trị (Cần Access Token + Quyền Admin)
    Route::middleware(['can'])->group(function () {

        Route::post('store', [CategoriesController::class, 'store'])
            ->middleware('role:category_create');

        Route::post('update', [CategoriesController::class, 'update'])
            ->middleware('role:category_edit');

        Route::post('delete', [CategoriesController::class, 'destroy'])
            ->middleware('role:category_delete');
    });
});

Route::prefix('products')->group(function () {
    // --- CÁC ROUTE PUBLIC (Ai cũng xem được, không cần Token) ---
    Route::get('', [ProductController::class, 'index']);
    Route::get('{slug}', [ProductController::class, 'detail']);

    // --- CÁC ROUTE PROTECTED (Cần Token + Quyền Admin) ---
    Route::middleware('can')->group(function () {

        // Tạo sản phẩm mới
        Route::post('create', [ProductController::class, 'create'])
            ->middleware('role:product_create');

        // Cập nhật sản phẩm
        Route::put('{product}', [ProductController::class, 'update'])
            ->middleware('role:product_edit');

        // Xóa sản phẩm
        Route::delete('{id}', [ProductController::class, 'delete'])
            ->middleware('role:product_delete');
    });
});



Route::prefix('cart')->group(function () {
    // Lấy giỏ hàng của chính mình (không dùng middleware 'can')
    Route::post('/', [CartController::class, 'getCart']);
});

Route::middleware('can')->prefix('cart')->group(function () {
    // Thêm sản phẩm vào giỏ
    Route::post('items', [CartController::class, 'addToCart']);

    // Cập nhật số lượng
    Route::put('/', [CartController::class, 'updateQuantity']);

    // Xóa item khỏi giỏ
    Route::post('delete', [CartController::class, 'deleteItemFromCart']);
});

Route::middleware('can')->group(function () {
    Route::prefix('user')->group(function () {
        // --- NHÓM QUYỀN CÁ NHÂN (Mọi user đã đăng nhập đều vào được) ---
        Route::get('/profile', [UserController::class, 'getProfile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::get('/address', [UserController::class, 'getAddresses']);
        Route::post('/address', [UserController::class, 'createAddress']);
        Route::patch('/address/{id}', [UserController::class, 'updateAddress']);
        Route::delete('/address/{id}', [UserController::class, 'deleteAddress']);
        Route::patch('/address/{id}/set-default', [UserController::class, 'setAddressDefault']);
        Route::post('/reset-password', [UserController::class, 'resetPassword']);


        // --- NHÓM QUYỀN ADMIN (Cần Access Token + Quyền Role cụ thể) ---

        Route::get('/', [UserController::class, 'getAllUsers'])
            ->middleware('role:view_all_users');

        // Xóa người dùng bất kỳ
        Route::delete('/{id}', [UserController::class, 'deleteUser'])
            ->middleware('role:delete_user');

        // Admin cập nhật mật khẩu cho user khác
        Route::put('/{id}', [UserController::class, 'updatePasswordByAdmin'])
            ->middleware('role:edit_user');
    });
});

// Quản lý Discounts
Route::prefix('discounts')->group(function () {

        // 1. PUBLIC ROUTES (Không cần đăng nhập)
         // GET /api/v1/discounts
       Route::get('', [DiscountController::class, 'getAllDiscounts']);
        // 2. PROTECTED ROUTES (Cần đăng nhập & Quyền)
       
        Route::post('', [DiscountController::class, 'createDiscount'])
            ->middleware('role:create_discount');

        Route::put('/{id}', [DiscountController::class, 'updateDiscount'])
            ->middleware('role:edit_discount');

        Route::delete('/{id}', [DiscountController::class, 'deleteDiscount'])
            ->middleware('role:delete_discount');

        Route::patch('/{id}/toggle-status', [DiscountController::class, 'toggleStatus'])
            ->middleware('role:edit_discount');
    
});



Route::post('/checkout', [CheckoutController::class, 'checkout']);


// VNPay callbacks (không cần auth)
Route::prefix('vnpay')->group(function () {
    Route::get('/callback', [CheckoutController::class, 'vnpayCallback']);
    Route::get('/ipn', [CheckoutController::class, 'vnpayIPN']);
});

Route::middleware(['auth:api', 'role:view_dashboard'])->prefix('admin')->group(function () {
    Route::get('/static', [AdminController::class, 'dashboardStats']);
});

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'getAllOrders']);
    Route::get('/user', [OrderController::class, 'findOrdersByUserId']);
    Route::get('/{orderId}', [OrderController::class, 'getOrderByOrderId']);
    Route::put('/{orderId}', [OrderController::class, 'updateStatusOrder']);
   
});