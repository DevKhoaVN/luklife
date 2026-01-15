<?php

namespace App\Providers;


use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;
use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Repositories\Contracts\TokenRepositoriesInterface;
use App\Repositories\Contracts\UserRepositoriesInterface;
use App\Repositories\Contracts\CartRepositoriesInterface;
use App\Repositories\Contracts\AddressRepositoriesInterface;
use App\Repositories\Iml\CategoriesRepositories;
use App\Repositories\Iml\ProductRepositories;
use App\Repositories\Iml\TokenRepositories;
use App\Repositories\Iml\UserRepository;
use App\Repositories\Iml\AddressRepositories;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
use App\Repositories\Contracts\DiscountRepositoriesInterface;
use App\Repositories\Iml\CartRepositories;
use App\Repositories\Iml\DiscountRepositories;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // register repo
        $this->app->bind(UserRepositoriesInterface::class, UserRepository::class);
        $this->app->bind(TokenRepositoriesInterface::class, TokenRepositories::class);
        $this->app->bind(CategoriesRepositoriesInterface::class, CategoriesRepositories::class);
        $this->app->bind(ProductRepositoriesInterface::class, ProductRepositories::class);
        $this->app->bind(CartRepositoriesInterface::class, CartRepositories::class);
        $this->app->bind(AddressRepositoriesInterface::class, AddressRepositories::class);
        $this->app->bind(DiscountRepositoriesInterface::class, DiscountRepositories::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('product', function ($value) {
            Log::info('Route binding:', [
                'value' => $value,
                'type' => gettype($value),
                'is_numeric' => is_numeric($value)
            ]);

            // Cast sang integer nếu là số
            if (is_numeric($value)) {
                return Product::findOrFail((int)$value);
            }

            // Nếu không phải số thì tìm theo slug
            return Product::where('slug', $value)->firstOrFail();
        });
    }
}
