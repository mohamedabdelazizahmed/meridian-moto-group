<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Motorcycle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Motorcycle>
 */
class MotorcycleFactory extends Factory
{
    protected $model = Motorcycle::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'brand_id' => Brand::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'price_from' => fake()->numberBetween(20000, 250000),
            'engine_cc' => fake()->numberBetween(125, 1800),
            'power_hp' => fake()->numberBetween(15, 220),
            'summary' => fake()->sentence(),
            'is_featured' => false,
            'is_published' => true,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function forBrand(Brand $brand): static
    {
        return $this->state(fn (array $attributes) => [
            'brand_id' => $brand->id,
        ]);
    }
}
