<?php

declare(strict_types=1);

use App\Models\Brand;
use App\Models\Location;
use App\Models\Motorcycle;
use App\Models\Promotion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\HttpFoundation\Response;
use Tests\Concerns\CountsQueries;

uses(RefreshDatabase::class, CountsQueries::class);

test('get brands returns only active brands with cache headers and correct query budget', function () {
    Brand::factory()->count(5)->create(['is_active' => true]);
    Brand::factory()->create(['is_active' => false]);

    $response = $this->assertQueryCountAtMost(1, fn () => $this->getJson('/api/v1/brands'));

    $response->assertStatus(Response::HTTP_OK)
        ->assertHeader('Cache-Control', 'max-age=60, public')
        ->assertHeader('ETag')
        ->assertJsonCount(5, 'data');

    foreach ($response->json('data') as $brand) {
        expect($brand)->not->toHaveKey('is_active');
        expect($brand)->not->toHaveKey('created_by');
        expect($brand)->not->toHaveKey('id');
    }
});

test('get brand detail returns published motorcycles and active promotions within budget', function () {
    $brand = Brand::factory()->create(['is_active' => true, 'slug' => 'apex']);
    Motorcycle::factory()->count(3)->create(['brand_id' => $brand->id, 'is_published' => true]);
    Motorcycle::factory()->create(['brand_id' => $brand->id, 'is_published' => false]); // draft

    Promotion::factory()->count(2)->create([
        'brand_id' => $brand->id,
        'is_published' => true,
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDay(),
    ]);

    $response = $this->assertQueryCountAtMost(3, fn () => $this->getJson('/api/v1/brands/apex'));

    $response->assertStatus(Response::HTTP_OK)
        ->assertHeader('Cache-Control', 'max-age=60, public')
        ->assertJsonPath('data.slug', 'apex')
        ->assertJsonCount(3, 'data.motorcycles')
        ->assertJsonCount(2, 'data.promotions');
});

test('inactive brand detail or unknown slug returns 404', function () {
    Brand::factory()->create(['is_active' => false, 'slug' => 'inactive-brand']);

    $this->getJson('/api/v1/brands/inactive-brand')
        ->assertStatus(Response::HTTP_NOT_FOUND)
        ->assertJson(['message' => 'Resource not found.']);

    $this->getJson('/api/v1/brands/non-existent')
        ->assertStatus(Response::HTTP_NOT_FOUND)
        ->assertJson(['message' => 'Resource not found.']);
});

test('get motorcycles paginates and filters by featured and brand with query budget', function () {
    $brand1 = Brand::factory()->create(['is_active' => true, 'slug' => 'volt']);
    $brand2 = Brand::factory()->create(['is_active' => true, 'slug' => 'nomad']);

    Motorcycle::factory()->count(4)->create(['brand_id' => $brand1->id, 'is_published' => true, 'is_featured' => true]);
    Motorcycle::factory()->count(2)->create(['brand_id' => $brand2->id, 'is_published' => true, 'is_featured' => false]);
    Motorcycle::factory()->create(['brand_id' => $brand1->id, 'is_published' => false]); // draft

    $response = $this->assertQueryCountAtMost(3, fn () => $this->getJson('/api/v1/motorcycles'));
    $response->assertStatus(Response::HTTP_OK)
        ->assertHeader('Cache-Control', 'max-age=60, public')
        ->assertJsonCount(6, 'data')
        ->assertJsonPath('meta.per_page', 12);

    $this->getJson('/api/v1/motorcycles?featured=1')
        ->assertStatus(Response::HTTP_OK)
        ->assertJsonCount(4, 'data');

    $this->getJson('/api/v1/motorcycles?brand=volt')
        ->assertStatus(Response::HTTP_OK)
        ->assertJsonCount(4, 'data');

    $this->getJson('/api/v1/motorcycles?brand=unknown')
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('get motorcycle detail returns motorcycle with brand summary within budget', function () {
    $brand = Brand::factory()->create(['is_active' => true]);
    $moto = Motorcycle::factory()->create([
        'brand_id' => $brand->id,
        'is_published' => true,
        'slug' => 'apex-rs-900',
    ]);

    $response = $this->assertQueryCountAtMost(2, fn () => $this->getJson('/api/v1/motorcycles/apex-rs-900'));

    $response->assertStatus(Response::HTTP_OK)
        ->assertHeader('Cache-Control', 'max-age=60, public')
        ->assertJsonPath('data.slug', 'apex-rs-900')
        ->assertJsonPath('data.brand.slug', $brand->slug);
});

test('draft motorcycle detail returns 404', function () {
    $brand = Brand::factory()->create(['is_active' => true]);
    Motorcycle::factory()->create([
        'brand_id' => $brand->id,
        'is_published' => false,
        'slug' => 'draft-moto',
    ]);

    $this->getJson('/api/v1/motorcycles/draft-moto')
        ->assertStatus(Response::HTTP_NOT_FOUND)
        ->assertJson(['message' => 'Resource not found.']);
});

test('get promotions returns only active promotions within budget', function () {
    $brand = Brand::factory()->create(['is_active' => true]);

    Promotion::factory()->create([
        'brand_id' => $brand->id,
        'is_published' => true,
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDay(),
    ]);

    Promotion::factory()->create([
        'brand_id' => $brand->id,
        'is_published' => false,
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDay(),
    ]);

    Promotion::factory()->create([
        'brand_id' => $brand->id,
        'is_published' => true,
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(5),
    ]);

    $response = $this->assertQueryCountAtMost(2, fn () => $this->getJson('/api/v1/promotions'));

    $response->assertStatus(Response::HTTP_OK)
        ->assertHeader('Cache-Control', 'max-age=60, public')
        ->assertJsonCount(1, 'data');
});

test('get locations returns locations ordered by city and name within budget', function () {
    Location::factory()->create(['city' => 'New York', 'name' => 'Downtown Store']);
    Location::factory()->create(['city' => 'Boston', 'name' => 'North End Store']);

    $response = $this->assertQueryCountAtMost(1, fn () => $this->getJson('/api/v1/locations'));

    $response->assertStatus(Response::HTTP_OK)
        ->assertHeader('Cache-Control', 'max-age=60, public')
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.city', 'Boston');
});

test('test ride request successfully creates record and returns 201 without internal id', function () {
    $brand = Brand::factory()->create(['is_active' => true]);
    $moto = Motorcycle::factory()->create(['brand_id' => $brand->id, 'is_published' => true, 'slug' => 'apex-rs-900']);

    $payload = [
        'name' => 'Jane Doe',
        'phone' => '+1 (555) 123-4567',
        'email' => 'jane@example.com',
        'preferred_date' => now()->addDay()->toDateString(),
        'motorcycle' => 'apex-rs-900',
    ];

    $response = $this->assertQueryCountAtMost(3, fn () => $this->postJson('/api/v1/test-ride-requests', $payload));

    $response->assertStatus(Response::HTTP_CREATED)
        ->assertJsonPath('data.name', 'Jane Doe')
        ->assertJsonPath('data.motorcycle.slug', 'apex-rs-900');

    expect($response->json('data'))->not->toHaveKey('id');

    $this->assertDatabaseHas('test_ride_requests', [
        'email' => 'jane@example.com',
        'motorcycle_id' => $moto->id,
    ]);
});

test('test ride request validation rules fail for draft motorcycle, past date, bad email, or honeypot', function () {
    $brand = Brand::factory()->create(['is_active' => true]);
    Motorcycle::factory()->create(['brand_id' => $brand->id, 'is_published' => false, 'slug' => 'draft-moto']);

    $basePayload = [
        'name' => 'Test User',
        'phone' => '1234567890',
        'email' => 'test@example.com',
        'preferred_date' => now()->addDay()->toDateString(),
    ];

    $this->postJson('/api/v1/test-ride-requests', array_merge($basePayload, ['motorcycle' => 'draft-moto']))
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);

    $this->postJson('/api/v1/test-ride-requests', array_merge($basePayload, ['preferred_date' => now()->subDay()->toDateString()]))
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);

    $this->postJson('/api/v1/test-ride-requests', array_merge($basePayload, ['email' => 'invalid-email']))
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);

    $this->postJson('/api/v1/test-ride-requests', array_merge($basePayload, ['website' => 'http://spam.com']))
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);

    $this->assertDatabaseCount('test_ride_requests', 0);
});

test('test ride request rate limiting restricts more than 5 requests per minute', function () {
    $payload = [
        'name' => 'Test User',
        'phone' => '1234567890',
        'email' => 'test@example.com',
        'preferred_date' => now()->addDay()->toDateString(),
    ];

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/v1/test-ride-requests', $payload)->assertStatus(Response::HTTP_CREATED);
    }

    $this->postJson('/api/v1/test-ride-requests', $payload)->assertStatus(Response::HTTP_TOO_MANY_REQUESTS);
});
