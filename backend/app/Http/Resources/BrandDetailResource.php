<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @property Brand $resource
 */
final class BrandDetailResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'slug' => $this->resource->slug,
            'segment' => $this->resource->segment,
            'tagline' => $this->resource->tagline,
            'description' => $this->resource->description,
            'accent_color' => $this->resource->accent_color,
            'logo_url' => $this->resource->logo_path ? Storage::disk('public')->url($this->resource->logo_path) : null,
            'hero_image_url' => $this->resource->hero_image_path ? Storage::disk('public')->url($this->resource->hero_image_path) : null,
            'is_active' => $this->resource->is_active,
            'motorcycles_count' => $this->whenCounted('motorcycles'),
            'promotions_count' => $this->whenCounted('promotions'),
            'created_at' => $this->resource->created_at?->toIso8601String(),
            'updated_at' => $this->resource->updated_at?->toIso8601String(),
        ];
    }
}
