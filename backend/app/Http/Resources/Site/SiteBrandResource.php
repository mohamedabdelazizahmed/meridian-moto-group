<?php

declare(strict_types=1);

namespace App\Http\Resources\Site;

use App\Http\Resources\Site\Concerns\HasImageUrl;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Brand $resource
 */
final class SiteBrandResource extends JsonResource
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
            'segment' => $this->resource->segment,
            'tagline' => $this->resource->tagline,
            'description' => $this->resource->description,
            'accent_color' => $this->resource->accent_color,
            'logo_url' => $this->imageUrl($this->resource->logo_path),
            'hero_image_url' => $this->imageUrl($this->resource->hero_image_path),
        ];
    }
}
