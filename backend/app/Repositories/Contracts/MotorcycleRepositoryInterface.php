<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DataTransferObjects\ListFilters;
use App\Models\Motorcycle;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MotorcycleRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Motorcycle>
     */
    public function paginate(User $actor, ListFilters $filters): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Motorcycle;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Motorcycle $motorcycle, array $data): Motorcycle;

    public function delete(Motorcycle $motorcycle): void;

    public function slugExists(string $slug, ?int $ignoreId = null): bool;
}
