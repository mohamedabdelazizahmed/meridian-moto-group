<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait FiltersByUserBrands
{
    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->isAdmin()) {
            return $query;
        }

        if ($user->isDataEntry()) {
            $brandIds = $user->assignedBrandIds();

            if ($brandIds->isEmpty()) {
                return $query->whereRaw('1 = 0');
            }

            return $query->whereIn($this->brandColumn(), $brandIds);
        }

        return $query->whereRaw('1 = 0');
    }

    protected function brandColumn(): string
    {
        return 'brand_id';
    }
}
