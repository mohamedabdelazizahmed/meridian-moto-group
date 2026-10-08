<?php

declare(strict_types=1);

namespace App\Http\Resources\Site;

use App\Models\TestRideRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property TestRideRequest $resource
 */
final class TestRideRequestResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->resource->name,
            'preferred_date' => $this->resource->preferred_date,
            'motorcycle' => $this->whenLoaded('motorcycle', fn () => [
                'name' => $this->resource->motorcycle?->name,
                'slug' => $this->resource->motorcycle?->slug,
            ]),
        ];
    }
}
