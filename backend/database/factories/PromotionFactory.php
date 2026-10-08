<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promotion>
 */
class PromotionFactory extends Factory
{
    protected $model = Promotion::class;

    public function definition(): array
    {
        return [
            'brand_id' => Brand::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'starts_at' => now()->subDays(5)->toDateString(),
            'ends_at' => now()->addDays(30)->toDateString(),
            'is_published' => true,
            'created_by' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->subDays(20)->toDateString(),
            'ends_at' => now()->subDays(5)->toDateString(),
        ]);
    }

    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->addDays(5)->toDateString(),
            'ends_at' => now()->addDays(35)->toDateString(),
        ]);
    }

    public function forBrand(Brand $brand): static
    {
        return $this->state(fn (array $attributes) => [
            'brand_id' => $brand->id,
        ]);
    }

    public function createdBy(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'created_by' => $user->id,
        ]);
    }
}
