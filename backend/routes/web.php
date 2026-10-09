<?php

use App\Http\Controllers\Docs\OpenApiSpecController;
use App\Http\Controllers\Docs\SwaggerUiController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/docs', SwaggerUiController::class);
Route::get('/docs/openapi.yaml', OpenApiSpecController::class);
