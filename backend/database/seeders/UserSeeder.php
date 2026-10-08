<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make(env('SEED_USER_PASSWORD', 'Meridian @2026'));

        $admin = User::updateOrCreate(
            ['email' => 'admin@meridian.test'],
            [
                'name' => 'Admin User',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);

        $apex = Brand::where('slug', 'apex')->first();
        $nomad = Brand::where('slug', 'nomad')->first();
        $volt = Brand::where('slug', 'volt')->first();

        $entryOne = User::updateOrCreate(
            ['email' => 'entry1@meridian.test'],
            [
                'name' => 'Entry One',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );
        $entryOne->syncRoles(['data_entry']);
        if ($apex && $nomad) {
            $entryOne->brands()->sync([$apex->id, $nomad->id]);
        }

        $entryTwo = User::updateOrCreate(
            ['email' => 'entry2@meridian.test'],
            [
                'name' => 'Entry Two',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );
        $entryTwo->syncRoles(['data_entry']);
        if ($volt) {
            $entryTwo->brands()->sync([$volt->id]);
        }
    }
}
