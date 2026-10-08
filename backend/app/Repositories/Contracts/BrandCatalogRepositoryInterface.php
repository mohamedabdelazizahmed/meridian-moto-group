<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Collection;

interface BrandCatalogRepositoryInterface
{
    /**
     * @return Collection<int, Brand>
     */
    public function allActive(): Collection;

    public function findActiveBySlug(string $slug): ?Brand;
}
