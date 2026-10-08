<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\DataTransferObjects\Site\MotorcycleCatalogFilters;
use App\Models\Motorcycle;
use App\Repositories\Contracts\MotorcycleCatalogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class MotorcycleCatalogRepository implements MotorcycleCatalogRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<Motorcycle>
     */
    public function paginatePublished(MotorcycleCatalogFilters $filters): LengthAwarePaginator
    {
        $query = Motorcycle::published()
            ->select(['id', 'brand_id', 'name', 'slug', 'price_from', 'engine_cc', 'power_hp', 'summary', 'image_path', 'is_featured', 'is_published'])
            ->with(['brand' => fn ($q) => $q->select(['id', 'name', 'slug', 'accent_color'])])
            ->orderBy('brand_id')
            ->orderBy('name');

        if ($filters->featured !== null) {
            $query->where('is_featured', $filters->featured);
        }

        if ($filters->brandSlug) {
            $query->whereHas('brand', fn ($q) => $q->where('slug', $filters->brandSlug)->where('is_active', true));
        }

        return $query->paginate($filters->perPage);
    }

    public function findPublishedBySlug(string $slug): ?Motorcycle
    {
        return Motorcycle::published()
            ->where('slug', $slug)
            ->select(['id', 'brand_id', 'name', 'slug', 'price_from', 'engine_cc', 'power_hp', 'summary', 'image_path', 'is_featured', 'is_published'])
            ->with(['brand' => fn ($q) => $q->select(['id', 'name', 'slug', 'segment', 'tagline', 'description', 'accent_color', 'logo_path', 'hero_image_path'])])
            ->first();
    }

    public function findPublishedIdBySlug(string $slug): ?int
    {
        /** @var int|null */
        return Motorcycle::published()->where('slug', $slug)->value('id');
    }
}
