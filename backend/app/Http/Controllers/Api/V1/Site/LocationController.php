<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\Site\SiteLocationResource;
use App\Services\Site\LocationCatalogService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class LocationController extends Controller
{
    public function __construct(
        private readonly LocationCatalogService $locationService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return SiteLocationResource::collection($this->locationService->list());
    }
}
