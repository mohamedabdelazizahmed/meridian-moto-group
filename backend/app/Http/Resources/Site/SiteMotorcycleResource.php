<?php

declare(strict_types=1);

namespace App\Http\Resources\Site;

use App\Http\Resources\Site\Concerns\HasImageUrl;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Motorcycle $resource
 */
final class SiteMotorcycleResource extends JsonResource
{
    use HasImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->resource->name,
            'slug' => $this->resource->slug,
            'price_from' => (float) $this->resource->price_from,
            'engine_cc' => $this->resource->engine_cc,
            'power_hp' => $this->resource->power_hp,
            'summary' => $this->resource->summary,
            'image_url' => $this->imageUrl($this->resource->image_path),
            'is_featured' => (bool) $this->resource->is_featured,
            'brand' => new SiteBrandSummaryResource($this->whenLoaded('brand')),
        ];
    }
}
