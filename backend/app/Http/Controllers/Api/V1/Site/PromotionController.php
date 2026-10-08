<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\Site\SitePromotionResource;
use App\Services\Site\PromotionCatalogService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class PromotionController extends Controller
{
    public function __construct(
        private readonly PromotionCatalogService $promotionService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return SitePromotionResource::collection($this->promotionService->list());
    }
}
