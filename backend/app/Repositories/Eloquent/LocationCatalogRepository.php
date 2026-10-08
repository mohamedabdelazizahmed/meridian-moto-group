<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Location;
use App\Repositories\Contracts\LocationCatalogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class LocationCatalogRepository implements LocationCatalogRepositoryInterface
{
    /**
     * @return Collection<int, Location>
     */
    public function all(): Collection
    {
        return Location::select(['id', 'name', 'type', 'city', 'address', 'phone', 'latitude', 'longitude'])
            ->orderBy('city')
            ->orderBy('name')
            ->get();
    }
}
