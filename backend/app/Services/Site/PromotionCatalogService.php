<?php

declare(strict_types=1);

namespace App\Services\Site;

use App\Models\Promotion;
use App\Repositories\Contracts\PromotionCatalogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class PromotionCatalogService
{
    public function __construct(
        private readonly PromotionCatalogRepositoryInterface $promotionRepository,
    ) {}

    /**
     * @return Collection<int, Promotion>
     */
    public function list(): Collection
    {
        return $this->promotionRepository->allActive();
    }
}
