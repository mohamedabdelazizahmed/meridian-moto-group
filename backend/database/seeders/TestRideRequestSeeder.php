<?php

namespace Database\Seeders;

use App\Models\Motorcycle;
use App\Models\TestRideRequest;
use Illuminate\Database\Seeder;

class TestRideRequestSeeder extends Seeder
{
    public function run(): void
    {
        $motorcycles = Motorcycle::take(3)->get();

        if ($motorcycles->count() < 3) {
            return;
        }

        if (TestRideRequest::count() >= 3) {
            return;
        }

        foreach ($motorcycles as $moto) {
            TestRideRequest::firstOrCreate(
                ['email' => fake()->unique()->safeEmail(), 'motorcycle_id' => $moto->id],
                [
                    'name' => fake()->name(),
                    'phone' => fake()->phoneNumber(),
                    'preferred_date' => now()->addDays(rand(2, 10))->toDateString(),
                ]
            );
        }
    }
}
