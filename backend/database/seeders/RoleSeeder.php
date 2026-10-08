<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleName;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

final class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Role::firstOrCreate(['name' => RoleName::Admin->value, 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => RoleName::DataEntry->value, 'guard_name' => 'web']);
    }
}
