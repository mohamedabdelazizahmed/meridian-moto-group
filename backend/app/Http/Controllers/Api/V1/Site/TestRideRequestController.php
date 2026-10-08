<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Site;

use App\DataTransferObjects\Site\TestRideRequestData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Site\StoreTestRideRequestRequest;
use App\Http\Resources\Site\TestRideRequestResource;
use App\Services\Site\TestRideRequestService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class TestRideRequestController extends Controller
{
    public function __construct(
        private readonly TestRideRequestService $testRideService,
    ) {}

    public function store(StoreTestRideRequestRequest $request): JsonResponse
    {
        $dto = TestRideRequestData::fromRequest($request);
        $testRide = $this->testRideService->create($dto);

        return (new TestRideRequestResource($testRide))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
