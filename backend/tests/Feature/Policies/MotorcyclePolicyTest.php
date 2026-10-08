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

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(BrandSeeder::class);
});

test('admin can perform all motorcycle abilities', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $brand = Brand::first();
    $motorcycle = Motorcycle::factory()->create(['brand_id' => $brand->id]);

    expect(Gate::forUser($admin)->allows('viewAny', Motorcycle::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('view', $motorcycle))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', [Motorcycle::class, $brand->id]))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $motorcycle))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $motorcycle))->toBeTrue();
});

test('data entry user can manage motorcycles for assigned brands only', function () {
    $apex = Brand::where('slug', 'apex')->first();
    $volt = Brand::where('slug', 'volt')->first();

    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry->brands()->sync([$apex->id]);

    $apexMoto = Motorcycle::factory()->create(['brand_id' => $apex->id]);
    $voltMoto = Motorcycle::factory()->create(['brand_id' => $volt->id]);

    expect(Gate::forUser($entry)->allows('viewAny', Motorcycle::class))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('view', $apexMoto))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('update', $apexMoto))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('delete', $apexMoto))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('create', [Motorcycle::class, $apex->id]))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('view', $voltMoto))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('update', $voltMoto))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('delete', $voltMoto))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('create', [Motorcycle::class, $volt->id]))->toBeFalse();
});

test('data entry user with no brands is denied all motorcycle actions', function () {
    $brand = Brand::first();
    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $motorcycle = Motorcycle::factory()->create(['brand_id' => $brand->id]);

    expect(Gate::forUser($entry)->allows('viewAny', Motorcycle::class))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('view', $motorcycle))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('update', $motorcycle))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('delete', $motorcycle))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('create', [Motorcycle::class, $brand->id]))->toBeFalse();
});

test('user with no role is denied all motorcycle actions', function () {
    $brand = Brand::first();
    $user = User::factory()->create();
    $motorcycle = Motorcycle::factory()->create(['brand_id' => $brand->id]);

    expect(Gate::forUser($user)->allows('viewAny', Motorcycle::class))->toBeFalse()
        ->and(Gate::forUser($user)->allows('view', $motorcycle))->toBeFalse()
        ->and(Gate::forUser($user)->allows('update', $motorcycle))->toBeFalse()
        ->and(Gate::forUser($user)->allows('delete', $motorcycle))->toBeFalse()
        ->and(Gate::forUser($user)->allows('create', [Motorcycle::class, $brand->id]))->toBeFalse();
});
