<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @property Promotion $resource
 */
final class PromotionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'description' => $this->resource->description,
            'image_url' => $this->resource->image_path ? Storage::disk('public')->url($this->resource->image_path) : null,
            'starts_at' => $this->resource->starts_at?->toDateString(),
            'ends_at' => $this->resource->ends_at?->toDateString(),
            'is_published' => $this->resource->is_published,
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'created_by' => $this->whenLoaded('creator', fn () => $this->resource->creator?->name),
            'created_at' => $this->resource->created_at?->toIso8601String(),
            'updated_at' => $this->resource->updated_at?->toIso8601String(),
        ];
    }
}
