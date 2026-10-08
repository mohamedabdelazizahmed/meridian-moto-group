<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Api\V1\Admin\MotorcycleController as AdminMotorcycleController;
use App\Http\Controllers\Api\V1\Admin\PromotionController as AdminPromotionController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PingController;
use App\Http\Controllers\Api\V1\Site;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/ping', PingController::class);

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    Route::middleware(['cache.headers:public;max_age=60;etag'])->group(function () {
        Route::get('/brands', [Site\BrandController::class, 'index']);
        Route::get('/brands/{slug}', [Site\BrandController::class, 'show']);
        Route::get('/motorcycles', [Site\MotorcycleController::class, 'index']);
        Route::get('/motorcycles/{slug}', [Site\MotorcycleController::class, 'show']);
        Route::get('/promotions', [Site\PromotionController::class, 'index']);
        Route::get('/locations', [Site\LocationController::class, 'index']);
    });

    Route::post('/test-ride-requests', [Site\TestRideRequestController::class, 'store'])
        ->middleware('throttle:test-ride');

    Route::prefix('admin')
        ->middleware('auth:sanctum')
        ->group(function () {
            Route::apiResource('brands', AdminBrandController::class)->parameters(['brands' => 'brand:id']);
            Route::apiResource('motorcycles', AdminMotorcycleController::class)->parameters(['motorcycles' => 'motorcycle:id']);
            Route::apiResource('promotions', AdminPromotionController::class)->parameters(['promotions' => 'promotion:id']);
            Route::apiResource('users', UserController::class)->parameters(['users' => 'user:id']);
        });
});
