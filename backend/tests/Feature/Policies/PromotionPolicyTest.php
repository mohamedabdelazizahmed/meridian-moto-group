<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
use App\Models\Promotion;
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

test('admin can perform all promotion abilities', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $brand = Brand::first();
    $promotion = Promotion::factory()->create(['brand_id' => $brand->id]);

    expect(Gate::forUser($admin)->allows('viewAny', Promotion::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('view', $promotion))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', [Promotion::class, $brand->id]))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $promotion))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $promotion))->toBeTrue();
});

test('data entry user can manage promotions for assigned brands only', function () {
    $apex = Brand::where('slug', 'apex')->first();
    $volt = Brand::where('slug', 'volt')->first();

    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry->brands()->sync([$apex->id]);

    $apexPromo = Promotion::factory()->create(['brand_id' => $apex->id]);
    $voltPromo = Promotion::factory()->create(['brand_id' => $volt->id]);

    expect(Gate::forUser($entry)->allows('viewAny', Promotion::class))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('view', $apexPromo))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('update', $apexPromo))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('delete', $apexPromo))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('create', [Promotion::class, $apex->id]))->toBeTrue()
        ->and(Gate::forUser($entry)->allows('view', $voltPromo))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('update', $voltPromo))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('delete', $voltPromo))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('create', [Promotion::class, $volt->id]))->toBeFalse();
});
