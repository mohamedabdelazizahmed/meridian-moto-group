<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\DataTransferObjects\ListFilters;
use App\Models\User;
use App\Repositories\Contracts\AdminUserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class AdminUserRepository implements AdminUserRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<User>
     */
    public function paginate(ListFilters $filters): LengthAwarePaginator
    {
        $query = User::with(['roles', 'brands'])
            ->latest();

        if ($filters->search) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$filters->search}%")
                ->orWhere('email', 'like', "%{$filters->search}%"));
        }

        if ($filters->brandId) {
            $query->whereHas('brands', fn ($q) => $q->where('brands.id', $filters->brandId));
        }

        return $query->paginate($filters->perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): User
    {
        $user = User::create($data);

        return $user->load(['roles', 'brands']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh()->load(['roles', 'brands']);
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    /**
     * @param  array<int>  $brandIds
     */
    public function syncBrands(User $user, array $brandIds): void
    {
        $user->brands()->sync($brandIds);
    }
}
