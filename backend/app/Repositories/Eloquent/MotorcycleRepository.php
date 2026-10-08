<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\DataTransferObjects\ListFilters;
use App\Models\Motorcycle;
use App\Models\User;
use App\Repositories\Contracts\MotorcycleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class MotorcycleRepository implements MotorcycleRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Motorcycle>
     */
    public function paginate(User $actor, ListFilters $filters): LengthAwarePaginator
    {
        $query = Motorcycle::forUser($actor)
            ->with('brand')
            ->latest();

        if ($filters->search) {
            $query->where('name', 'like', "%{$filters->search}%");
        }

        if ($filters->brandId) {
            $query->where('brand_id', $filters->brandId);
        }

        if ($filters->status) {
            $isPublished = $filters->status === 'published';
            $query->where('is_published', $isPublished);
        }

        return $query->paginate($filters->perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Motorcycle
    {
        $motorcycle = Motorcycle::create($data);

        return $motorcycle->load('brand');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Motorcycle $motorcycle, array $data): Motorcycle
    {
        $motorcycle->update($data);

        return $motorcycle->fresh()->load('brand');
    }

    public function delete(Motorcycle $motorcycle): void
    {
        $motorcycle->delete();
    }

    public function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        return Motorcycle::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists();
    }
}
