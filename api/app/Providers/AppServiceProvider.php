<?php

namespace App\Providers;


use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;
use App\Repositories\Contracts\TokenRepositoriesInterface;
use App\Repositories\Contracts\UserRepositoriesInterface;
use App\Repositories\Iml\CategoriesRepositories;
use App\Repositories\Iml\TokenRepositories;
use App\Repositories\Iml\UserRepository;
use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Repositories\Iml\ProductRepositories;

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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
