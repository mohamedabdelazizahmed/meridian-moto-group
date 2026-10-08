<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ImageStorageInterface;
use App\Contracts\SlugGeneratorInterface;
use App\DataTransferObjects\BrandData;
use App\DataTransferObjects\ListFilters;
use App\Exceptions\BrandInUseException;
use App\Models\Brand;
use App\Models\User;
use App\Repositories\Contracts\BrandRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class BrandService
{
    public function __construct(
        private readonly BrandRepositoryInterface $brandRepository,
        private readonly ImageStorageInterface $imageStorage,
        private readonly SlugGeneratorInterface $slugGenerator,
    ) {}

    /**
     * @return LengthAwarePaginator<Brand>
     */
    public function list(User $actor, ListFilters $filters): LengthAwarePaginator
    {
        return $this->brandRepository->paginate($actor, $filters);
    }

    public function create(BrandData $dto): Brand
    {
        return DB::transaction(function () use ($dto) {
            $slug = $dto->slug ?: $this->slugGenerator->generate(
                $dto->name,
                fn (string $s) => $this->brandRepository->slugExists($s)
            );

            $logoPath = $dto->logo ? $this->imageStorage->store($dto->logo, 'brands/logos') : null;
            $heroPath = $dto->heroImage ? $this->imageStorage->store($dto->heroImage, 'brands/heroes') : null;

            return $this->brandRepository->create([
                'name' => $dto->name,
                'slug' => $slug,
                'segment' => $dto->segment,
                'tagline' => $dto->tagline,
                'description' => $dto->description,
                'accent_color' => $dto->accentColor,
                'logo_path' => $logoPath,
                'hero_image_path' => $heroPath,
                'is_active' => $dto->isActive,
            ]);
        });
    }

    public function update(Brand $brand, BrandData $dto): Brand
    {
        return DB::transaction(function () use ($brand, $dto) {
            $slug = $brand->slug;
            if ($dto->slug && $dto->slug !== $brand->slug) {
                $slug = $this->slugGenerator->generate(
                    $dto->slug,
                    fn (string $s) => $this->brandRepository->slugExists($s, $brand->id)
                );
            } elseif (! $dto->slug && $dto->name !== $brand->name) {
                $slug = $this->slugGenerator->generate(
                    $dto->name,
                    fn (string $s) => $this->brandRepository->slugExists($s, $brand->id)
                );
            }

            $newLogoPath = $dto->logo ? $this->imageStorage->store($dto->logo, 'brands/logos') : null;
            $newHeroPath = $dto->heroImage ? $this->imageStorage->store($dto->heroImage, 'brands/heroes') : null;

            $oldLogoPath = $brand->logo_path;
            $oldHeroPath = $brand->hero_image_path;

            $updated = $this->brandRepository->update($brand, [
                'name' => $dto->name,
                'slug' => $slug,
                'segment' => $dto->segment,
                'tagline' => $dto->tagline,
                'description' => $dto->description,
                'accent_color' => $dto->accentColor,
                'logo_path' => $newLogoPath ?? $oldLogoPath,
                'hero_image_path' => $newHeroPath ?? $oldHeroPath,
                'is_active' => $dto->isActive,
            ]);

            if ($newLogoPath && $oldLogoPath) {
                $this->imageStorage->delete($oldLogoPath);
            }
            if ($newHeroPath && $oldHeroPath) {
                $this->imageStorage->delete($oldHeroPath);
            }

            return $updated;
        });
    }

    public function delete(Brand $brand): void
    {
        DB::transaction(function () use ($brand) {
            if ($this->brandRepository->hasRelatedRecords($brand)) {
                throw new BrandInUseException('Cannot delete brand that has associated motorcycles or promotions.');
            }

            $logoPath = $brand->logo_path;
            $heroPath = $brand->hero_image_path;

            $this->brandRepository->delete($brand);

            $this->imageStorage->delete($logoPath);
            $this->imageStorage->delete($heroPath);
        });
    }
}
