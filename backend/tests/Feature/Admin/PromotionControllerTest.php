<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
use App\Models\User;
use Database\Seeders\BrandSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(BrandSeeder::class);
    Storage::fake('public');
});

test('admin can create and update promotion with created_by set correctly', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $apex = Brand::where('slug', 'apex')->first();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/promotions', [
        'brand_id' => $apex->id,
        'title' => 'Summer Promo',
        'description' => 'Discount on all bikes',
        'starts_at' => now()->toDateString(),
        'ends_at' => now()->addDays(10)->toDateString(),
        'is_published' => true,
    ]);

    $response->assertStatus(Response::HTTP_CREATED)
        ->assertJsonPath('data.title', 'Summer Promo')
        ->assertJsonPath('data.created_by', $admin->name);

    $promoId = $response->json('data.id');

    $otherAdmin = User::factory()->withRole(RoleName::Admin)->create();
    $updateResponse = $this->actingAs($otherAdmin)->putJson("/api/v1/admin/promotions/{$promoId}", [
        'brand_id' => $apex->id,
        'title' => 'Summer Promo Updated',
        'starts_at' => now()->toDateString(),
        'ends_at' => now()->addDays(10)->toDateString(),
        'is_published' => true,
    ]);

    $updateResponse->assertStatus(Response::HTTP_OK)
        ->assertJsonPath('data.title', 'Summer Promo Updated')
        ->assertJsonPath('data.created_by', $admin->name); // created_by unchanged on update
});

test('ends_at before starts_at returns unprocessable entity', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $apex = Brand::where('slug', 'apex')->first();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/promotions', [
        'brand_id' => $apex->id,
        'title' => 'Invalid Promo',
        'starts_at' => now()->addDays(5)->toDateString(),
        'ends_at' => now()->toDateString(),
        'is_published' => true,
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors(['ends_at']);
});
