<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\DataTransferObjects\ListFilters;
use App\DataTransferObjects\UserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\UserListRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    public function index(UserListRequest $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', User::class);

        $filters = ListFilters::fromRequest($request);
        $users = $this->userService->list($filters);

        return UserResource::collection($users);
    }

    public function show(User $user): UserResource
    {
        Gate::authorize('view', $user);

        return new UserResource($user->load(['roles', 'brands']));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        Gate::authorize('create', User::class);

        $dto = UserData::fromRequest($request);
        $user = $this->userService->create($dto);

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        Gate::authorize('update', $user);

        $dto = UserData::fromRequest($request);
        $updated = $this->userService->update($user, $dto, $request->user());

        return new UserResource($updated);
    }

    public function destroy(Request $request, User $user): Response
    {
        Gate::authorize('delete', $user);

        $this->userService->delete($user, $request->user());

        return response()->noContent();
    }
}
