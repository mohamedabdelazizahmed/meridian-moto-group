<?php

namespace Database\Factories;

use App\Models\Motorcycle;
use App\Models\TestRideRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TestRideRequest>
 */
class TestRideRequestFactory extends Factory
{
    protected $model = TestRideRequest::class;

    public function definition(): array
    {
        return [
            'motorcycle_id' => Motorcycle::factory(),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'preferred_date' => now()->addDays(rand(1, 14))->toDateString(),
        ];
    }
}
