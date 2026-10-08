<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\DataTransferObjects\ListFilters;
use App\Models\Brand;
use App\Models\User;
use App\Repositories\Contracts\BrandRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class BrandRepository implements BrandRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Brand>
     */
    public function paginate(User $actor, ListFilters $filters): LengthAwarePaginator
    {
        $query = Brand::forUser($actor)
            ->withCount(['motorcycles', 'promotions'])
            ->latest();

        if ($filters->search) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$filters->search}%")
                ->orWhere('segment', 'like', "%{$filters->search}%"));
        }

        if ($filters->status) {
            $isActive = $filters->status === 'published';
            $query->where('is_active', $isActive);
        }

        return $query->paginate($filters->perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Brand
    {
        return Brand::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Brand $brand, array $data): Brand
    {
        $brand->update($data);

        return $brand->fresh();
    }

    public function delete(Brand $brand): void
    {
        $brand->delete();
    }

    public function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        return Brand::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists();
    }

    public function hasRelatedRecords(Brand $brand): bool
    {
        return $brand->motorcycles()->exists() || $brand->promotions()->exists();
    }
}
