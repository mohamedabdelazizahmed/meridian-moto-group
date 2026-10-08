<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Motorcycle;
use Illuminate\Database\Eloquent\Model;

final class MotorcyclePolicy extends BrandOwnedPolicy
{
    protected function brandIdOf(Model $model): int
    {
        /** @var Motorcycle $model */
        return (int) $model->brand_id;
    }
}
