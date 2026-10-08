<?php

declare(strict_types=1);

namespace App\Http\Resources\Site;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Location $resource
 */
final class SiteLocationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->resource->name,
            'type' => $this->resource->type?->value ?? $this->resource->type,
            'city' => $this->resource->city,
            'address' => $this->resource->address,
            'phone' => $this->resource->phone,
            'latitude' => $this->resource->latitude !== null ? (float) $this->resource->latitude : null,
            'longitude' => $this->resource->longitude !== null ? (float) $this->resource->longitude : null,
        ];
    }
}
