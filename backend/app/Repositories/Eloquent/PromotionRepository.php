<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\DataTransferObjects\ListFilters;
use App\Models\Promotion;
use App\Models\User;
use App\Repositories\Contracts\PromotionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class PromotionRepository implements PromotionRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Promotion>
     */
    public function paginate(User $actor, ListFilters $filters): LengthAwarePaginator
    {
        $query = Promotion::forUser($actor)
            ->with(['brand', 'creator'])
            ->latest();

        if ($filters->search) {
            $query->where('title', 'like', "%{$filters->search}%");
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
    public function create(array $data): Promotion
    {
        $promotion = Promotion::create($data);

        return $promotion->load(['brand', 'creator']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Promotion $promotion, array $data): Promotion
    {
        $promotion->update($data);

        return $promotion->fresh()->load(['brand', 'creator']);
    }

    public function delete(Promotion $promotion): void
    {
        $promotion->delete();
    }
}
