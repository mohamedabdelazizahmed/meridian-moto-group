<?php

declare(strict_types=1);

namespace App\Services\Site;

use App\Models\Brand;
use App\Repositories\Contracts\BrandCatalogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class BrandCatalogService
{
    public function __construct(
        private readonly BrandCatalogRepositoryInterface $brandRepository,
    ) {}

    /**
     * @return Collection<int, Brand>
     */
    public function list(): Collection
    {
        return $this->brandRepository->allActive();
    }

    public function find(string $slug): Brand
    {
        $brand = $this->brandRepository->findActiveBySlug($slug);
        if (! $brand) {
            throw new ModelNotFoundException('Brand not found.');
        }

        return $brand;
    }
}
