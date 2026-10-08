<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Site;

use App\DataTransferObjects\Site\MotorcycleCatalogFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\Site\ListMotorcyclesRequest;
use App\Http\Resources\Site\SiteMotorcycleResource;
use App\Services\Site\MotorcycleCatalogService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class MotorcycleController extends Controller
{
    public function __construct(
        private readonly MotorcycleCatalogService $motorcycleService,
    ) {}

    public function index(ListMotorcyclesRequest $request): AnonymousResourceCollection
    {
        $filters = MotorcycleCatalogFilters::fromRequest($request);
        $paginator = $this->motorcycleService->list($filters);

        return SiteMotorcycleResource::collection($paginator);
    }

    public function show(string $slug): SiteMotorcycleResource
    {
        $motorcycle = $this->motorcycleService->find($slug);

        return new SiteMotorcycleResource($motorcycle);
    }
}
