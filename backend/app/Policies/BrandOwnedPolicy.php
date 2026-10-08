<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

abstract class BrandOwnedPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isDataEntry();
    }

    public function view(User $user, Model $model): bool
    {
        return $user->hasBrandAccess($this->brandIdOf($model));
    }

    public function create(User $user, int $brandId): bool
    {
        return $user->hasBrandAccess($brandId);
    }

    public function update(User $user, Model $model): bool
    {
        return $user->hasBrandAccess($this->brandIdOf($model));
    }

    public function delete(User $user, Model $model): bool
    {
        return $user->hasBrandAccess($this->brandIdOf($model));
    }

    abstract protected function brandIdOf(Model $model): int;
}
