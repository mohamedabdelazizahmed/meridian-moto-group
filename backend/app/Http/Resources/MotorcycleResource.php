<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @property Motorcycle $resource
 */
final class MotorcycleResource extends JsonResource
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
            'price_from' => $this->resource->price_from,
            'engine_cc' => $this->resource->engine_cc,
            'power_hp' => $this->resource->power_hp,
            'summary' => $this->resource->summary,
            'image_url' => $this->resource->image_path ? Storage::disk('public')->url($this->resource->image_path) : null,
            'is_featured' => $this->resource->is_featured,
            'is_published' => $this->resource->is_published,
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'created_at' => $this->resource->created_at?->toIso8601String(),
            'updated_at' => $this->resource->updated_at?->toIso8601String(),
        ];
    }
}
