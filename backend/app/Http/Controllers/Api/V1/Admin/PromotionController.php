<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\DataTransferObjects\ListFilters;
use App\DataTransferObjects\PromotionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListRequest;
use App\Http\Requests\Admin\StorePromotionRequest;
use App\Http\Requests\Admin\UpdatePromotionRequest;
use App\Http\Resources\PromotionResource;
use App\Models\Promotion;
use App\Services\PromotionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class PromotionController extends Controller
{
    public function __construct(
        private readonly PromotionService $promotionService,
    ) {}

    public function index(ListRequest $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Promotion::class);

        $filters = ListFilters::fromRequest($request);
        $promotions = $this->promotionService->list($request->user(), $filters);

        return PromotionResource::collection($promotions);
    }

    public function show(Promotion $promotion): PromotionResource
    {
        Gate::authorize('view', $promotion);

        return new PromotionResource($promotion->load(['brand', 'creator']));
    }

    public function store(StorePromotionRequest $request): JsonResponse
    {
        $dto = PromotionData::fromRequest($request);
        Gate::authorize('create', [Promotion::class, $dto->brandId]);

        $promotion = $this->promotionService->create($dto, $request->user());

        return (new PromotionResource($promotion))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion): PromotionResource
    {
        Gate::authorize('update', $promotion);

        $dto = PromotionData::fromRequest($request);
        if ($promotion->brand_id !== $dto->brandId) {
            Gate::authorize('create', [Promotion::class, $dto->brandId]);
        }

        $updated = $this->promotionService->update($promotion, $dto);

        return new PromotionResource($updated);
    }

    public function destroy(Promotion $promotion): Response
    {
        Gate::authorize('delete', $promotion);

        $this->promotionService->delete($promotion);

        return response()->noContent();
    }
}
