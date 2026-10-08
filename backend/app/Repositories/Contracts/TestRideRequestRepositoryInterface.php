<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\TestRideRequest;

interface TestRideRequestRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): TestRideRequest;
}
