<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Model;

final class PromotionPolicy extends BrandOwnedPolicy
{
    protected function brandIdOf(Model $model): int
    {
        /** @var Promotion $model */
        return (int) $model->brand_id;
    }
}
