<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\DataTransferObjects\BrandData;
use App\DataTransferObjects\ListFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListRequest;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Http\Resources\BrandDetailResource;
use App\Models\Brand;
use App\Services\BrandService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class BrandController extends Controller
{
    public function __construct(
        private readonly BrandService $brandService,
    ) {}

    public function index(ListRequest $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Brand::class);

        $filters = ListFilters::fromRequest($request);
        $brands = $this->brandService->list($request->user(), $filters);

        return BrandDetailResource::collection($brands);
    }

    public function show(Brand $brand): BrandDetailResource
    {
        Gate::authorize('view', $brand);

        return new BrandDetailResource($brand->loadCount(['motorcycles', 'promotions']));
    }

    public function store(StoreBrandRequest $request): JsonResponse
    {
        Gate::authorize('create', Brand::class);

        $dto = BrandData::fromRequest($request);
        $brand = $this->brandService->create($dto);

        return (new BrandDetailResource($brand->loadCount(['motorcycles', 'promotions'])))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateBrandRequest $request, Brand $brand): BrandDetailResource
    {
        Gate::authorize('update', $brand);

        $dto = BrandData::fromRequest($request);
        $updated = $this->brandService->update($brand, $dto);

        return new BrandDetailResource($updated->loadCount(['motorcycles', 'promotions']));
    }

    public function destroy(Brand $brand): Response
    {
        Gate::authorize('delete', $brand);

        $this->brandService->delete($brand);

        return response()->noContent();
    }
}
