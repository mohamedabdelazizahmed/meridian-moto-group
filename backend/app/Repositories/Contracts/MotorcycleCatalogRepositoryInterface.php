<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DataTransferObjects\Site\MotorcycleCatalogFilters;
use App\Models\Motorcycle;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MotorcycleCatalogRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Motorcycle>
     */
    public function paginatePublished(MotorcycleCatalogFilters $filters): LengthAwarePaginator;

    public function findPublishedBySlug(string $slug): ?Motorcycle;

    public function findPublishedIdBySlug(string $slug): ?int;
}
