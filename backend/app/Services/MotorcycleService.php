<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ImageStorageInterface;
use App\Contracts\SlugGeneratorInterface;
use App\DataTransferObjects\ListFilters;
use App\DataTransferObjects\MotorcycleData;
use App\Models\Motorcycle;
use App\Models\User;
use App\Repositories\Contracts\MotorcycleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class MotorcycleService
{
    public function __construct(
        private readonly MotorcycleRepositoryInterface $motorcycleRepository,
        private readonly ImageStorageInterface $imageStorage,
        private readonly SlugGeneratorInterface $slugGenerator,
    ) {}

    /**
     * @return LengthAwarePaginator<Motorcycle>
     */
    public function list(User $actor, ListFilters $filters): LengthAwarePaginator
    {
        return $this->motorcycleRepository->paginate($actor, $filters);
    }

    public function create(MotorcycleData $dto): Motorcycle
    {
        return DB::transaction(function () use ($dto) {
            $slug = $dto->slug ?: $this->slugGenerator->generate(
                $dto->name,
                fn (string $s) => $this->motorcycleRepository->slugExists($s)
            );

            $imagePath = $dto->image ? $this->imageStorage->store($dto->image, 'motorcycles') : null;

            return $this->motorcycleRepository->create([
                'brand_id' => $dto->brandId,
                'name' => $dto->name,
                'slug' => $slug,
                'price_from' => $dto->priceFrom,
                'engine_cc' => $dto->engineCc,
                'power_hp' => $dto->powerHp,
                'summary' => $dto->summary,
                'image_path' => $imagePath,
                'is_featured' => $dto->isFeatured,
                'is_published' => $dto->isPublished,
            ]);
        });
    }

    public function update(Motorcycle $motorcycle, MotorcycleData $dto): Motorcycle
    {
        return DB::transaction(function () use ($motorcycle, $dto) {
            $slug = $motorcycle->slug;
            if ($dto->slug && $dto->slug !== $motorcycle->slug) {
                $slug = $this->slugGenerator->generate(
                    $dto->slug,
                    fn (string $s) => $this->motorcycleRepository->slugExists($s, $motorcycle->id)
                );
            } elseif (! $dto->slug && $dto->name !== $motorcycle->name) {
                $slug = $this->slugGenerator->generate(
                    $dto->name,
                    fn (string $s) => $this->motorcycleRepository->slugExists($s, $motorcycle->id)
                );
            }

            $newImagePath = $dto->image ? $this->imageStorage->store($dto->image, 'motorcycles') : null;
            $oldImagePath = $motorcycle->image_path;

            $updated = $this->motorcycleRepository->update($motorcycle, [
                'brand_id' => $dto->brandId,
                'name' => $dto->name,
                'slug' => $slug,
                'price_from' => $dto->priceFrom,
                'engine_cc' => $dto->engineCc,
                'power_hp' => $dto->powerHp,
                'summary' => $dto->summary,
                'image_path' => $newImagePath ?? $oldImagePath,
                'is_featured' => $dto->isFeatured,
                'is_published' => $dto->isPublished,
            ]);

            if ($newImagePath && $oldImagePath) {
                $this->imageStorage->delete($oldImagePath);
            }

            return $updated;
        });
    }

    public function delete(Motorcycle $motorcycle): void
    {
        DB::transaction(function () use ($motorcycle) {
            $imagePath = $motorcycle->image_path;
            $this->motorcycleRepository->delete($motorcycle);
            $this->imageStorage->delete($imagePath);
        });
    }
}
