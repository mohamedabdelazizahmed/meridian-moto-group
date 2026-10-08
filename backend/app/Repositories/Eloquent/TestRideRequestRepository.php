<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\TestRideRequest;
use App\Repositories\Contracts\TestRideRequestRepositoryInterface;

final class TestRideRequestRepository implements TestRideRequestRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): TestRideRequest
    {
        $testRide = TestRideRequest::create($attributes);

        return $testRide->load(['motorcycle' => fn ($q) => $q->select(['id', 'name', 'slug'])]);
    }
}
