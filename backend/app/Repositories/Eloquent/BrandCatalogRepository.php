<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Brand;
use App\Repositories\Contracts\BrandCatalogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class BrandCatalogRepository implements BrandCatalogRepositoryInterface
{
    /**
     * @return Collection<int, Brand>
     */
    public function allActive(): Collection
    {
        return Brand::where('is_active', true)
            ->select(['id', 'name', 'slug', 'segment', 'tagline', 'description', 'accent_color', 'logo_path', 'hero_image_path'])
            ->orderBy('id')
            ->get();
    }

    public function findActiveBySlug(string $slug): ?Brand
    {
        return Brand::where('slug', $slug)
            ->where('is_active', true)
            ->select(['id', 'name', 'slug', 'segment', 'tagline', 'description', 'accent_color', 'logo_path', 'hero_image_path'])
            ->with([
                'motorcycles' => fn ($q) => $q->published()
                    ->select(['id', 'brand_id', 'name', 'slug', 'price_from', 'engine_cc', 'power_hp', 'summary', 'image_path', 'is_featured', 'is_published'])
                    ->orderBy('brand_id')
                    ->orderBy('name'),
                'promotions' => fn ($q) => $q->published()->active()
                    ->select(['id', 'brand_id', 'title', 'description', 'image_path', 'starts_at', 'ends_at', 'is_published'])
                    ->orderBy('ends_at'),
            ])
            ->first();
    }
}
