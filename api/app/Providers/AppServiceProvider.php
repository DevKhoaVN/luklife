<?php

namespace App\Providers;


use Illuminate\Support\ServiceProvider;
use App\Repositories\Iml\AuthRepositories;
use App\Repositories\Contracts\AuthRepositoriesInterface;
use App\Repositories\Contracts\TokenRepositoriesInterface;
use App\Repositories\Contracts\UserRepositoriesInterface;
use App\Repositories\Iml\TokenRepositories;
use App\Repositories\Iml\UserRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // register repo
        $this->app->bind(AuthRepositoriesInterface::class, AuthRepositories::class);
        $this->app->bind(UserRepositoriesInterface::class, UserRepository::class);
        $this->app->bind(TokenRepositoriesInterface::class, TokenRepositories::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
