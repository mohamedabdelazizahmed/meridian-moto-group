<?php

declare(strict_types=1);

namespace App\Services\Site;

use App\DataTransferObjects\Site\TestRideRequestData;
use App\Models\TestRideRequest;
use App\Repositories\Contracts\MotorcycleCatalogRepositoryInterface;
use App\Repositories\Contracts\TestRideRequestRepositoryInterface;

final class TestRideRequestService
{
    public function __construct(
        private readonly TestRideRequestRepositoryInterface $testRideRepository,
        private readonly MotorcycleCatalogRepositoryInterface $motorcycleRepository,
    ) {}

    public function create(TestRideRequestData $dto): TestRideRequest
    {
        $motorcycleId = $dto->motorcycleId;
        if ($motorcycleId === null && $dto->motorcycleSlug) {
            $motorcycleId = $this->motorcycleRepository->findPublishedIdBySlug($dto->motorcycleSlug);
        }

        return $this->testRideRepository->create([
            'name' => $dto->name,
            'phone' => $dto->phone,
            'email' => $dto->email,
            'preferred_date' => $dto->preferredDate,
            'motorcycle_id' => $motorcycleId,
        ]);
    }
}
