<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Location;
use Illuminate\Database\Eloquent\Collection;

interface LocationCatalogRepositoryInterface
{
    /**
     * @return Collection<int, Location>
     */
    public function all(): Collection;
}
