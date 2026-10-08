<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\RoleName;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function withRole(RoleName|string $role): static
    {
        $roleValue = $role instanceof RoleName ? $role->value : $role;

        return $this->afterCreating(function (User $user) use ($roleValue) {
            $user->assignRole($roleValue);
        });
    }

    public function withBrands(array|Collection $brands): static
    {
        return $this->afterCreating(function (User $user) use ($brands) {
            $user->brands()->sync($brands);
        });
    }
}
