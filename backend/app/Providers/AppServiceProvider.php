<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! app()->isProduction());

        RateLimiter::for('login', function (Request $request): Limit {
            $email = (string) $request->input('email', '');

            return Limit::perMinute(5)->by(mb_strtolower($email).'|'.$request->ip());
        });

        RateLimiter::for('test-ride', function (Request $request): Limit {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
