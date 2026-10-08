<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;

final class BrandPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isDataEntry();
    }

    public function view(User $user, Brand $brand): bool
    {
        return $user->hasBrandAccess((int) $brand->id);
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Brand $brand): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Brand $brand): bool
    {
        return $user->isAdmin();
    }
}
