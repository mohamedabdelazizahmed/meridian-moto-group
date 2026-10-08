<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
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

test('admin can perform all brand abilities', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $brand = Brand::first();

    expect(Gate::forUser($admin)->allows('viewAny', Brand::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('view', $brand))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', Brand::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $brand))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $brand))->toBeTrue();
});

test('data entry can view assigned brands only and cannot mutate brands', function () {
    $apex = Brand::where('slug', 'apex')->first();
    $volt = Brand::where('slug', 'volt')->first();

    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry->brands()->sync([$apex->id]);

    expect(Gate::forUser($entry)->allows('viewAny', Brand::class))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('view', $apex))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('view', $volt))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('create', Brand::class))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('update', $apex))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('delete', $apex))->toBeFalse();
});
