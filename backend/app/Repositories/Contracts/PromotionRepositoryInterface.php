<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DataTransferObjects\ListFilters;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PromotionRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Promotion>
     */
    public function paginate(User $actor, ListFilters $filters): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Promotion;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Promotion $promotion, array $data): Promotion;

    public function delete(Promotion $promotion): void;
}
