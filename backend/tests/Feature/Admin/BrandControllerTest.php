<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
use App\Models\Motorcycle;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    Storage::fake('public');
});

test('unauthenticated request returns unauthorized', function () {
    $response = $this->getJson('/api/v1/admin/brands');
    $response->assertStatus(Response::HTTP_UNAUTHORIZED);
});

test('admin can create, update, and delete brand', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/brands', [
        'name' => 'Nova',
        'segment' => 'Sport',
        'tagline' => 'Electric speed',
        'description' => 'Brand description',
        'accent_color' => '#FF0000',
        'is_active' => true,
    ]);

    $response->assertStatus(Response::HTTP_CREATED)
        ->assertJsonPath('data.name', 'Nova');

    $brandId = $response->json('data.id');

    $updateResponse = $this->actingAs($admin)->putJson("/api/v1/admin/brands/{$brandId}", [
        'name' => 'Nova Updated',
        'segment' => 'Sport',
        'accent_color' => '#00FF00',
        'is_active' => true,
    ]);

    $updateResponse->assertStatus(Response::HTTP_OK)
        ->assertJsonPath('data.name', 'Nova Updated');

    $deleteResponse = $this->actingAs($admin)->deleteJson("/api/v1/admin/brands/{$brandId}");
    $deleteResponse->assertStatus(Response::HTTP_NO_CONTENT);
});

test('data entry can view assigned brands only and cannot mutate brands', function () {
    $brand1 = Brand::factory()->create(['name' => 'Brand A']);
    $brand2 = Brand::factory()->create(['name' => 'Brand B']);

    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry->brands()->sync([$brand1->id]);

    $response = $this->actingAs($entry)->getJson('/api/v1/admin/brands');
    $response->assertStatus(Response::HTTP_OK)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $brand1->id);

    $createResponse = $this->actingAs($entry)->postJson('/api/v1/admin/brands', [
        'name' => 'Unauthorized Brand',
        'segment' => 'Sport',
        'accent_color' => '#FF0000',
    ]);
    $createResponse->assertStatus(Response::HTTP_FORBIDDEN);
});

test('invalid accent color returns unprocessable entity', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/brands', [
        'name' => 'Nova',
        'segment' => 'Sport',
        'accent_color' => 'invalid-color',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors(['accent_color']);
});

test('deleting a brand with motorcycles returns unprocessable entity', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $brand = Brand::factory()->create();
    Motorcycle::factory()->create(['brand_id' => $brand->id]);

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/brands/{$brand->id}");

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});
