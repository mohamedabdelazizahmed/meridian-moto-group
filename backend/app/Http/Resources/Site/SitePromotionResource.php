<?php

declare(strict_types=1);

namespace App\Http\Resources\Site;

use App\Http\Resources\Site\Concerns\HasImageUrl;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Promotion $resource
 */
final class SitePromotionResource extends JsonResource
{
    use HasImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->resource->title,
            'description' => $this->resource->description,
            'image_url' => $this->imageUrl($this->resource->image_path),
            'starts_at' => $this->resource->starts_at?->toIso8601String(),
            'ends_at' => $this->resource->ends_at?->toIso8601String(),
            'brand' => new SiteBrandSummaryResource($this->whenLoaded('brand')),
        ];
    }
}
