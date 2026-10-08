<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
use App\Models\Motorcycle;
use App\Models\User;
use Database\Seeders\BrandSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(BrandSeeder::class);
    Storage::fake('public');
});

test('motorcycles index filters by actor scope search and status', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $apex = Brand::where('slug', 'apex')->first();
    $volt = Brand::where('slug', 'volt')->first();

    Motorcycle::factory()->create(['brand_id' => $apex->id, 'name' => 'Apex RS', 'is_published' => true]);
    Motorcycle::factory()->create(['brand_id' => $apex->id, 'name' => 'Apex Draft', 'is_published' => false]);
    Motorcycle::factory()->create(['brand_id' => $volt->id, 'name' => 'Volt Pulse', 'is_published' => true]);

    $entry1 = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry1->brands()->sync([$apex->id]);

    $response = $this->actingAs($entry1)->getJson('/api/v1/admin/motorcycles?status=published');
    $response->assertStatus(Response::HTTP_OK)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Apex RS');
});

test('entry user creates motorcycle for assigned brand successfully', function () {
    $apex = Brand::where('slug', 'apex')->first();
    $entry1 = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry1->brands()->sync([$apex->id]);

    $file = UploadedFile::fake()->image('moto.jpg');

    $response = $this->actingAs($entry1)->postJson('/api/v1/admin/motorcycles', [
        'brand_id' => $apex->id,
        'name' => 'Apex New Model',
        'price_from' => 15000.00,
        'engine_cc' => 900,
        'power_hp' => 120,
        'summary' => 'Great new bike',
        'image' => $file,
        'is_featured' => true,
        'is_published' => true,
    ]);

    $response->assertStatus(Response::HTTP_CREATED)
        ->assertJsonPath('data.name', 'Apex New Model');

    expect($response->json('data.image_url'))->not->toBeNull();

    $moto = Motorcycle::where('name', 'Apex New Model')->first();
    Storage::disk('public')->assertExists($moto->image_path);
});

test('entry user cannot create motorcycle for unassigned brand', function () {
    $apex = Brand::where('slug', 'apex')->first();
    $volt = Brand::where('slug', 'volt')->first();

    $entry1 = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry1->brands()->sync([$apex->id]);

    $response = $this->actingAs($entry1)->postJson('/api/v1/admin/motorcycles', [
        'brand_id' => $volt->id,
        'name' => 'Volt Model',
        'price_from' => 12000.00,
        'engine_cc' => 500,
        'power_hp' => 80,
        'is_published' => true,
    ]);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
});

test('invalid motorcycle payload returns unprocessable entity', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $apex = Brand::where('slug', 'apex')->first();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/motorcycles', [
        'brand_id' => $apex->id,
        'name' => '',
        'price_from' => -10,
        'engine_cc' => -5,
        'power_hp' => 0,
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors(['name', 'price_from', 'engine_cc', 'power_hp']);
});

test('admin routes bind by numeric id', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $apex = Brand::where('slug', 'apex')->first();
    $moto = Motorcycle::factory()->create(['brand_id' => $apex->id, 'slug' => 'apex-test-slug']);

    $response = $this->actingAs($admin)->getJson("/api/v1/admin/motorcycles/{$moto->id}");
    $response->assertStatus(Response::HTTP_OK)
        ->assertJsonPath('data.id', $moto->id);
});

test('deleting motorcycle removes file and returns no content', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $apex = Brand::where('slug', 'apex')->first();
    $file = UploadedFile::fake()->image('moto.jpg');
    $path = $file->store('motorcycles', 'public');

    $moto = Motorcycle::factory()->create(['brand_id' => $apex->id, 'image_path' => $path]);

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/motorcycles/{$moto->id}");
    $response->assertStatus(Response::HTTP_NO_CONTENT);

    Storage::disk('public')->assertMissing($path);
});
