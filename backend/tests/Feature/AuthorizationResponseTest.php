<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
use App\Models\Motorcycle;
use App\Models\User;
use Database\Seeders\BrandSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(BrandSeeder::class);

    Route::middleware('auth:sanctum')->get('/api/v1/test-auth-moto/{motorcycle}', function (Motorcycle $motorcycle) {
        Gate::authorize('update', $motorcycle);

        return response()->json(['status' => 'ok'], Response::HTTP_OK);
    });
});

test('unauthorized request without token returns 401', function () {
    $brand = Brand::first();
    $motorcycle = Motorcycle::factory()->create(['brand_id' => $brand->id]);

    $response = $this->getJson("/api/v1/test-auth-moto/{$motorcycle->id}");

    $response->assertStatus(Response::HTTP_UNAUTHORIZED)
        ->assertJson(['message' => 'Unauthenticated.']);
});

test('forbidden request by entry user without brand access returns 403 json message', function () {
    $apex = Brand::where('slug', 'apex')->first();
    $volt = Brand::where('slug', 'volt')->first();

    $entry2 = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry2->brands()->sync([$volt->id]);

    $token = $entry2->createToken('test-token')->plainTextToken;

    $apexMoto = Motorcycle::factory()->create(['brand_id' => $apex->id]);

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson("/api/v1/test-auth-moto/{$apexMoto->id}");

    $response->assertStatus(Response::HTTP_FORBIDDEN)
        ->assertJson(['message' => 'This action is unauthorized.']);
});

test('successful request by admin returns 200 ok', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $token = $admin->createToken('test-token')->plainTextToken;

    $brand = Brand::first();
    $motorcycle = Motorcycle::factory()->create(['brand_id' => $brand->id]);

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson("/api/v1/test-auth-moto/{$motorcycle->id}");

    $response->assertStatus(Response::HTTP_OK)
        ->assertJson(['status' => 'ok']);
});
