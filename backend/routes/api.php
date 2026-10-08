<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\Admin\BrandController;
use App\Http\Controllers\Api\V1\Admin\MotorcycleController;
use App\Http\Controllers\Api\V1\Admin\PromotionController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PingController;
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

    Route::prefix('admin')
        ->middleware('auth:sanctum')
        ->group(function () {
            Route::apiResource('brands', BrandController::class)->parameters(['brands' => 'brand:id']);
            Route::apiResource('motorcycles', MotorcycleController::class)->parameters(['motorcycles' => 'motorcycle:id']);
            Route::apiResource('promotions', PromotionController::class)->parameters(['promotions' => 'promotion:id']);
            Route::apiResource('users', UserController::class)->parameters(['users' => 'user:id']);
        });
});
