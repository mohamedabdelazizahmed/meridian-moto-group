<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Collection;

interface PromotionCatalogRepositoryInterface
{
    /**
     * @return Collection<int, Promotion>
     */
    public function allActive(): Collection;
}
