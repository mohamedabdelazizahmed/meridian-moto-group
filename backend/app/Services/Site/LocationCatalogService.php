<?php

declare(strict_types=1);

namespace App\Services\Site;

use App\Models\Location;
use App\Repositories\Contracts\LocationCatalogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class LocationCatalogService
{
    public function __construct(
        private readonly LocationCatalogRepositoryInterface $locationRepository,
    ) {}

    /**
     * @return Collection<int, Location>
     */
    public function list(): Collection
    {
        return $this->locationRepository->all();
    }
}
