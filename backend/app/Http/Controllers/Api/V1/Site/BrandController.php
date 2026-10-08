<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\Site\SiteBrandDetailResource;
use App\Http\Resources\Site\SiteBrandResource;
use App\Services\Site\BrandCatalogService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class BrandController extends Controller
{
    public function __construct(
        private readonly BrandCatalogService $brandService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return SiteBrandResource::collection($this->brandService->list());
    }

    public function show(string $slug): SiteBrandDetailResource
    {
        $brand = $this->brandService->find($slug);

        return new SiteBrandDetailResource($brand);
    }
}
