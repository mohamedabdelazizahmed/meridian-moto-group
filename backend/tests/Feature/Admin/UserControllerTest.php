<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
use App\Models\User;
use Database\Seeders\BrandSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\HttpFoundation\Response;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(BrandSeeder::class);
});

test('data entry is forbidden on user endpoints', function () {
    $entry = User::factory()->withRole(RoleName::DataEntry)->create();

    $response = $this->actingAs($entry)->getJson('/api/v1/admin/users');
    $response->assertStatus(Response::HTTP_FORBIDDEN);
});

test('admin can create data entry user with brand ids and password is hidden', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $apex = Brand::where('slug', 'apex')->first();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/users', [
        'name' => 'New Staff',
        'email' => 'staff@meridian.test',
        'password' => 'Password123',
        'role' => 'data_entry',
        'brand_ids' => [$apex->id],
    ]);

    $response->assertStatus(Response::HTTP_CREATED)
        ->assertJsonPath('data.name', 'New Staff')
        ->assertJsonPath('data.role', 'data_entry')
        ->assertJsonCount(1, 'data.brands')
        ->assertJsonMissing(['password']);
});

test('data entry user without brand ids returns unprocessable entity', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/users', [
        'name' => 'New Staff',
        'email' => 'staff@meridian.test',
        'password' => 'Password123',
        'role' => 'data_entry',
        'brand_ids' => [],
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors(['brand_ids']);
});

test('duplicate email returns unprocessable entity', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    User::factory()->create(['email' => 'existing@meridian.test']);

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/users', [
        'name' => 'Another',
        'email' => 'existing@meridian.test',
        'password' => 'Password123',
        'role' => 'admin',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors(['email']);
});

test('weak password returns unprocessable entity', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/users', [
        'name' => 'Another',
        'email' => 'new@meridian.test',
        'password' => 'weak',
        'role' => 'admin',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors(['password']);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/users/{$admin->id}");

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('delete user revokes tokens and deletes record', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $target = User::factory()->withRole(RoleName::DataEntry)->create();
    $token = $target->createToken('test-token')->plainTextToken;

    expect($target->tokens()->count())->toBe(1);

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/users/{$target->id}");

    $response->assertStatus(Response::HTTP_NO_CONTENT);
    expect(User::find($target->id))->toBeNull();
});

test('admin can filter users by role and search', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    User::factory()->withRole(RoleName::DataEntry)->create(['name' => 'Specific Entry']);

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/users?role=data_entry&search=Specific');

    $response->assertStatus(Response::HTTP_OK)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Specific Entry');
});

test('admin cannot change their own role', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();

    $response = $this->actingAs($admin)->putJson("/api/v1/admin/users/{$admin->id}", [
        'name' => $admin->name,
        'email' => $admin->email,
        'role' => 'data_entry',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});
