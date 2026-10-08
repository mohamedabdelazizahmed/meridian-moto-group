<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DataTransferObjects\ListFilters;
use App\Models\Brand;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BrandRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Brand>
     */
    public function paginate(User $actor, ListFilters $filters): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Brand;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Brand $brand, array $data): Brand;

    public function delete(Brand $brand): void;

    public function slugExists(string $slug, ?int $ignoreId = null): bool;

    public function hasRelatedRecords(Brand $brand): bool;
}
