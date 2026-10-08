<?php

use App\Models\Brand;
use App\Models\Location;
use App\Models\Motorcycle;
use App\Models\Promotion;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('database seeder runs successfully and seeds correct data idempotently', function () {
    $this->seed(DatabaseSeeder::class);

    // Run second time to test idempotency
    $this->seed(DatabaseSeeder::class);

    // Roles exist
    expect(Role::where('name', 'admin')->exists())->toBeTrue()
        ->and(Role::where('name', 'data_entry')->exists())->toBeTrue();

    // Admin user has admin role
    $admin = User::where('email', 'admin@meridian.test')->first();
    expect($admin)->not->toBeNull()
        ->and($admin->hasRole('admin'))->toBeTrue();

    // Entry1 has data_entry role and apex, nomad brands
    $entry1 = User::where('email', 'entry1@meridian.test')->first();
    expect($entry1)->not->toBeNull()
        ->and($entry1->hasRole('data_entry'))->toBeTrue()
        ->and($entry1->brands->pluck('slug')->sort()->values()->all())->toBe(['apex', 'nomad']);

    // Entry2 has volt brand
    $entry2 = User::where('email', 'entry2@meridian.test')->first();
    expect($entry2)->not->toBeNull()
        ->and($entry2->hasRole('data_entry'))->toBeTrue()
        ->and($entry2->brands->pluck('slug')->all())->toBe(['volt']);

    // 4 brands
    expect(Brand::count())->toBe(4);

    // 6 motorcycles, 5 published, 4 featured
    expect(Motorcycle::count())->toBe(6)
        ->and(Motorcycle::published()->count())->toBe(5)
        ->and(Motorcycle::featured()->count())->toBe(4);

    // Promotion active published count is 3
    expect(Promotion::active()->published()->count())->toBe(3);

    // One draft and one expired promotion exist
    expect(Promotion::where('is_published', false)->count())->toBe(1)
        ->and(Promotion::where('ends_at', '<', now()->toDateString())->count())->toBe(1);

    // 4 locations
    expect(Location::count())->toBe(4);
});
