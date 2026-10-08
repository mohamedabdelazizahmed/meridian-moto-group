<?php

namespace Database\Factories;

use App\Enums\LocationType;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Location>
 */
class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company().' Center',
            'type' => fake()->randomElement(LocationType::cases()),
            'city' => fake()->city(),
            'address' => fake()->streetAddress(),
            'phone' => fake()->phoneNumber(),
            'latitude' => fake()->latitude(22.0, 26.0),
            'longitude' => fake()->longitude(51.0, 56.0),
        ];
    }

    public function showroom(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => LocationType::Showroom,
        ]);
    }

    public function service(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => LocationType::Service,
        ]);
    }
}
