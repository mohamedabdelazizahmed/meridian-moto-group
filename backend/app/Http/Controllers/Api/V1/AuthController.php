<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DataTransferObjects\Auth\LoginData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\AuthResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(LoginData::fromRequest($request));

        return (new AuthResource($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->currentUser($request->user());

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
