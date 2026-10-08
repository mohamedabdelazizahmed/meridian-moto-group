<?php

use App\Enums\LocationType;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Motorcycle;
use App\Models\Promotion;
use App\Models\TestRideRequest;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('brand factory creates valid record', function () {
    $brand = Brand::factory()->create();
    expect($brand)->toBeInstanceOf(Brand::class)
        ->and($brand->name)->not->toBeEmpty();
});

test('motorcycle factory draft state creates unpublished motorcycle', function () {
    $moto = Motorcycle::factory()->draft()->create();
    expect($moto->is_published)->toBeFalse();
});

test('promotion factory expired state is not in active scope', function () {
    $promo = Promotion::factory()->expired()->create(['is_published' => true]);
    expect(Promotion::active()->where('id', $promo->id)->exists())->toBeFalse();
});

test('user factory withRole and withBrands works correctly', function () {
    $this->seed(RoleSeeder::class);
    $brands = Brand::factory(2)->create();

    $user = User::factory()->withRole('data_entry')->withBrands($brands)->create();

    expect($user->hasRole('data_entry'))->toBeTrue()
        ->and($user->brands)->toHaveCount(2);
});

test('location and test ride request factories work', function () {
    $location = Location::factory()->showroom()->create();
    expect($location->type)->toBe(LocationType::Showroom);

    $testRide = TestRideRequest::factory()->create();
    expect($testRide)->toBeInstanceOf(TestRideRequest::class)
        ->and($testRide->motorcycle_id)->not->toBeNull();
});
