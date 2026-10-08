<?php

declare(strict_types=1);

namespace App\Http\Resources\Site;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Brand $resource
 */
final class SiteBrandSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->resource->name,
            'slug' => $this->resource->slug,
            'accent_color' => $this->resource->accent_color,
        ];
    }
}
