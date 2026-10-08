<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            BrandSeeder::class,
            UserSeeder::class,
            MotorcycleSeeder::class,
            PromotionSeeder::class,
            LocationSeeder::class,
            TestRideRequestSeeder::class,
        ]);
    }
}
