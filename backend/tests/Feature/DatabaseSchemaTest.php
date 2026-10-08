<?php

use App\Enums\LocationType;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Motorcycle;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can be attached to brands and brand users relationship works', function () {
    $user = User::factory()->create();
    $brand = Brand::create([
        'name' => 'Volt',
        'slug' => 'volt',
        'segment' => 'Electric',
        'accent_color' => '#22D3C5',
    ]);

    $user->brands()->attach($brand);

    expect($user->brands)->toHaveCount(1)
        ->and($brand->users)->toHaveCount(1)
        ->and($brand->users->first()->id)->toBe($user->id);
});

test('deleting a brand cascades to its motorcycles and promotions', function () {
    $brand = Brand::create([
        'name' => 'Apex',
        'slug' => 'apex',
        'segment' => 'Sport',
        'accent_color' => '#FF0000',
    ]);

    $motorcycle = Motorcycle::create([
        'brand_id' => $brand->id,
        'name' => 'Apex RS 900',
        'slug' => 'apex-rs-900',
        'price_from' => 15000.00,
        'engine_cc' => 900,
        'power_hp' => 180,
        'is_published' => true,
    ]);

    $promotion = Promotion::create([
        'brand_id' => $brand->id,
        'title' => 'Summer Sale',
        'starts_at' => now()->toDateString(),
        'ends_at' => now()->addDays(10)->toDateString(),
        'is_published' => true,
    ]);

    expect(Motorcycle::find($motorcycle->id))->not->toBeNull()
        ->and(Promotion::find($promotion->id))->not->toBeNull();

    $brand->delete();

    expect(Motorcycle::find($motorcycle->id))->toBeNull()
        ->and(Promotion::find($promotion->id))->toBeNull();
});

test('motorcycle published and featured scopes filter correctly', function () {
    $brand = Brand::create([
        'name' => 'Nomad',
        'slug' => 'nomad',
        'segment' => 'Adventure',
        'accent_color' => '#00FF00',
    ]);

    Motorcycle::create([
        'brand_id' => $brand->id,
        'name' => 'Nomad Horizon 1250',
        'slug' => 'nomad-horizon-1250',
        'price_from' => 18000.00,
        'engine_cc' => 1250,
        'power_hp' => 150,
        'is_published' => true,
        'is_featured' => true,
    ]);

    Motorcycle::create([
        'brand_id' => $brand->id,
        'name' => 'Unpublished Bike',
        'slug' => 'unpublished-bike',
        'price_from' => 10000.00,
        'engine_cc' => 600,
        'power_hp' => 90,
        'is_published' => false,
        'is_featured' => false,
    ]);

    expect(Motorcycle::published()->get())->toHaveCount(1)
        ->and(Motorcycle::featured()->get())->toHaveCount(1)
        ->and(Motorcycle::published()->featured()->get())->toHaveCount(1);
});

test('promotion active scope only returns promotions covering today', function () {
    $brand = Brand::create([
        'name' => 'Sovereign',
        'slug' => 'sovereign',
        'segment' => 'Cruiser',
        'accent_color' => '#0000FF',
    ]);

    // Active promotion covering today
    Promotion::create([
        'brand_id' => $brand->id,
        'title' => 'Active Promo',
        'starts_at' => now()->subDay()->toDateString(),
        'ends_at' => now()->addDay()->toDateString(),
        'is_published' => true,
    ]);

    // Inactive promotion in the past
    Promotion::create([
        'brand_id' => $brand->id,
        'title' => 'Past Promo',
        'starts_at' => now()->subDays(10)->toDateString(),
        'ends_at' => now()->subDays(5)->toDateString(),
        'is_published' => true,
    ]);

    expect(Promotion::active()->get())->toHaveCount(1)
        ->and(Promotion::active()->first()->title)->toBe('Active Promo');
});

test('location type casts to LocationType enum', function () {
    $location = Location::create([
        'name' => 'Main Showroom',
        'type' => LocationType::Showroom,
        'city' => 'Dubai',
        'address' => 'Sheikh Zayed Road',
        'latitude' => 25.2048493,
        'longitude' => 55.2707828,
    ]);

    expect($location->type)->toBeInstanceOf(LocationType::class)
        ->and($location->type)->toBe(LocationType::Showroom)
        ->and($location->type->value)->toBe('showroom');
});
