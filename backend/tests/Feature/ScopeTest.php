<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\Brand;
use App\Models\Motorcycle;
use App\Models\Promotion;
use App\Models\User;
use Database\Seeders\BrandSeeder;
use Database\Seeders\MotorcycleSeeder;
use Database\Seeders\PromotionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(BrandSeeder::class);
    $this->seed(MotorcycleSeeder::class);
    $this->seed(PromotionSeeder::class);
});

test('motorcycle scope forUser filters correctly per role and assigned brands', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $adminMotos = Motorcycle::forUser($admin)->get();
    expect($adminMotos->count())->toBe(Motorcycle::count());

    $apex = Brand::where('slug', 'apex')->first();
    $nomad = Brand::where('slug', 'nomad')->first();
    $volt = Brand::where('slug', 'volt')->first();

    $entry1 = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry1->brands()->sync([$apex->id, $nomad->id]);

    $entry1Motos = Motorcycle::forUser($entry1)->get();
    expect($entry1Motos->count())->toBeGreaterThan(0);
    foreach ($entry1Motos as $moto) {
        expect([$apex->id, $nomad->id])->toContain($moto->brand_id);
    }

    $entry2 = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry2->brands()->sync([$volt->id]);

    $entry2Motos = Motorcycle::forUser($entry2)->get();
    expect($entry2Motos->count())->toBeGreaterThan(0);
    foreach ($entry2Motos as $moto) {
        expect($moto->brand_id)->toBe($volt->id);
    }

    $emptyEntry = User::factory()->withRole(RoleName::DataEntry)->create();
    expect(Motorcycle::forUser($emptyEntry)->count())->toBe(0);
});

test('promotion scope forUser filters correctly per role and assigned brands', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    expect(Promotion::forUser($admin)->count())->toBe(Promotion::count());

    $apex = Brand::where('slug', 'apex')->first();
    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry->brands()->sync([$apex->id]);

    $promos = Promotion::forUser($entry)->get();
    foreach ($promos as $promo) {
        expect($promo->brand_id)->toBe($apex->id);
    }
});

test('brand scope forUser filters correctly per role and assigned brands', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    expect(Brand::forUser($admin)->count())->toBe(Brand::count());

    $apex = Brand::where('slug', 'apex')->first();
    $nomad = Brand::where('slug', 'nomad')->first();

    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $entry->brands()->sync([$apex->id, $nomad->id]);

    $brands = Brand::forUser($entry)->get();
    expect($brands->count())->toBe(2);
    $slugs = $brands->pluck('slug')->all();
    expect($slugs)->toContain('apex', 'nomad');
});
