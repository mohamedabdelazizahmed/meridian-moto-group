<?php

declare(strict_types=1);

use App\Enums\RoleName;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('admin can perform all user abilities', function () {
    $admin = User::factory()->withRole(RoleName::Admin)->create();
    $targetUser = User::factory()->create();

    expect(Gate::forUser($admin)->allows('viewAny', User::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('view', $targetUser))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', User::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $targetUser))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $targetUser))->toBeTrue();
});

test('data entry is denied all user abilities', function () {
    $entry = User::factory()->withRole(RoleName::DataEntry)->create();
    $targetUser = User::factory()->create();

    expect(Gate::forUser($entry)->allows('viewAny', User::class))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('view', $targetUser))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('create', User::class))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('update', $targetUser))->toBeFalse()
        ->and(Gate::forUser($entry)->allows('delete', $targetUser))->toBeFalse();
});
