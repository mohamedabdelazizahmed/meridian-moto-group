<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\DataTransferObjects\ListFilters;
use App\DataTransferObjects\MotorcycleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListRequest;
use App\Http\Requests\Admin\StoreMotorcycleRequest;
use App\Http\Requests\Admin\UpdateMotorcycleRequest;
use App\Http\Resources\MotorcycleResource;
use App\Models\Motorcycle;
use App\Services\MotorcycleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class MotorcycleController extends Controller
{
    public function __construct(
        private readonly MotorcycleService $motorcycleService,
    ) {}

    public function index(ListRequest $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Motorcycle::class);

        $filters = ListFilters::fromRequest($request);
        $motorcycles = $this->motorcycleService->list($request->user(), $filters);

        return MotorcycleResource::collection($motorcycles);
    }

    public function show(Motorcycle $motorcycle): MotorcycleResource
    {
        Gate::authorize('view', $motorcycle);

        return new MotorcycleResource($motorcycle->load('brand'));
    }

    public function store(StoreMotorcycleRequest $request): JsonResponse
    {
        $dto = MotorcycleData::fromRequest($request);
        Gate::authorize('create', [Motorcycle::class, $dto->brandId]);

        $motorcycle = $this->motorcycleService->create($dto);

        return (new MotorcycleResource($motorcycle))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateMotorcycleRequest $request, Motorcycle $motorcycle): MotorcycleResource
    {
        Gate::authorize('update', $motorcycle);

        $dto = MotorcycleData::fromRequest($request);
        if ($motorcycle->brand_id !== $dto->brandId) {
            Gate::authorize('create', [Motorcycle::class, $dto->brandId]);
        }

        $updated = $this->motorcycleService->update($motorcycle, $dto);

        return new MotorcycleResource($updated);
    }

    public function destroy(Motorcycle $motorcycle): Response
    {
        Gate::authorize('delete', $motorcycle);

        $this->motorcycleService->delete($motorcycle);

        return response()->noContent();
    }
}
