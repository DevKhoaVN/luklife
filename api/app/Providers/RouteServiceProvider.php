<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
        Route::middleware("") 
            ->prefix('api') 
            ->name('api.') 
            ->group(base_path('routes/api.php')); // Tải từ
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
