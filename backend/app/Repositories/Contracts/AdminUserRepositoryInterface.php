<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DataTransferObjects\ListFilters;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminUserRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<User>
     */
    public function paginate(ListFilters $filters): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): User;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data): User;

    public function delete(User $user): void;

    /**
     * @param  array<int>  $brandIds
     */
    public function syncBrands(User $user, array $brandIds): void;
}
