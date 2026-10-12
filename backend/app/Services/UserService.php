<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\ListFilters;
use App\DataTransferObjects\UserData;
use App\Exceptions\CannotChangeOwnRoleException;
use App\Exceptions\CannotDeleteSelfException;
use App\Models\User;
use App\Repositories\Contracts\AdminUserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

final class UserService
{
    public function __construct(
        private readonly AdminUserRepositoryInterface $userRepository,
    ) {}

    /**
     * @return LengthAwarePaginator<User>
     */
    public function list(ListFilters $filters): LengthAwarePaginator
    {
        return $this->userRepository->paginate($filters);
    }

    public function create(UserData $dto): User
    {
        return DB::transaction(function () use ($dto) {
            $user = $this->userRepository->create([
                'name' => $dto->name,
                'email' => $dto->email,
                'password' => Hash::make($dto->password),
            ]);

            $user->syncRoles([$dto->role->value]);
            $this->userRepository->syncBrands($user, $dto->brandIds);

            return $user->fresh()->load(['roles', 'brands']);
        });
    }

    public function update(User $user, UserData $dto, ?User $actor = null): User
    {
        return DB::transaction(function () use ($user, $dto, $actor) {
            $currentRole = $user->roles->first()?->name;

            if ($actor && $user->id === $actor->id && $currentRole !== $dto->role->value) {
                throw new CannotChangeOwnRoleException('Admins cannot change their own role.');
            }

            $data = [
                'name' => $dto->name,
                'email' => $dto->email,
            ];

            if ($dto->password) {
                $data['password'] = Hash::make($dto->password);
            }

            $currentBrandIds = $user->brands->pluck('id')->sort()->values()->toArray();
            $newBrandIds = collect($dto->brandIds)->sort()->values()->toArray();

            $updatedUser = $this->userRepository->update($user, $data);

            $updatedUser->syncRoles([$dto->role->value]);
            $this->userRepository->syncBrands($updatedUser, $dto->brandIds);

            $roleChanged = $currentRole !== $dto->role->value;
            $brandsChanged = $currentBrandIds !== $newBrandIds;
            $passwordChanged = (bool) $dto->password;

            if ($roleChanged || $brandsChanged || $passwordChanged) {
                $updatedUser->tokens()->delete();
            }

            return $updatedUser->fresh()->load(['roles', 'brands']);
        });
    }

    public function delete(User $user, User $actor): void
    {
        DB::transaction(function () use ($user, $actor) {
            if ($user->id === $actor->id) {
                throw new CannotDeleteSelfException('Admins cannot delete their own account.');
            }

            $user->tokens()->delete();
            $this->userRepository->delete($user);
        });
    }
}
