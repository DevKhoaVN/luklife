<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;

// Version 1 hiện tại đang tiển khai
Route::prefix('v1')->group(function () {
    require __DIR__ . '/api/v1.php';
});

// Version 2  triển khai sau he !
Route::prefix('v2')->group(function () {
    require __DIR__ . '/api/v2.php';
});