<?php

declare(strict_types=1);

namespace App\Services\Site;

use App\DataTransferObjects\Site\MotorcycleCatalogFilters;
use App\Models\Motorcycle;
use App\Repositories\Contracts\MotorcycleCatalogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class MotorcycleCatalogService
{
    public function __construct(
        private readonly MotorcycleCatalogRepositoryInterface $motorcycleRepository,
    ) {}

    /**
     * @return LengthAwarePaginator<Motorcycle>
     */
    public function list(MotorcycleCatalogFilters $filters): LengthAwarePaginator
    {
        return $this->motorcycleRepository->paginatePublished($filters);
    }

    public function find(string $slug): Motorcycle
    {
        $motorcycle = $this->motorcycleRepository->findPublishedBySlug($slug);
        if (! $motorcycle) {
            throw new ModelNotFoundException('Motorcycle not found.');
        }

        return $motorcycle;
    }
}
