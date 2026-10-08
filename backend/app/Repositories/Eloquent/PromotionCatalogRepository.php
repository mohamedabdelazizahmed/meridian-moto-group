<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Promotion;
use App\Repositories\Contracts\PromotionCatalogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class PromotionCatalogRepository implements PromotionCatalogRepositoryInterface
{
    /**
     * @return Collection<int, Promotion>
     */
    public function allActive(): Collection
    {
        return Promotion::published()
            ->active()
            ->select(['id', 'brand_id', 'title', 'description', 'image_path', 'starts_at', 'ends_at', 'is_published'])
            ->with(['brand' => fn ($q) => $q->select(['id', 'name', 'slug', 'accent_color'])])
            ->orderBy('ends_at')
            ->get();
    }
}
