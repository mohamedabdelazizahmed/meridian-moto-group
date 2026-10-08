<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ImageStorageInterface;
use App\DataTransferObjects\ListFilters;
use App\DataTransferObjects\PromotionData;
use App\Models\Promotion;
use App\Models\User;
use App\Repositories\Contracts\PromotionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class PromotionService
{
    public function __construct(
        private readonly PromotionRepositoryInterface $promotionRepository,
        private readonly ImageStorageInterface $imageStorage,
    ) {}

    /**
     * @return LengthAwarePaginator<Promotion>
     */
    public function list(User $actor, ListFilters $filters): LengthAwarePaginator
    {
        return $this->promotionRepository->paginate($actor, $filters);
    }

    public function create(PromotionData $dto, User $actor): Promotion
    {
        return DB::transaction(function () use ($dto, $actor) {
            $imagePath = $dto->image ? $this->imageStorage->store($dto->image, 'promotions') : null;

            return $this->promotionRepository->create([
                'brand_id' => $dto->brandId,
                'title' => $dto->title,
                'description' => $dto->description,
                'image_path' => $imagePath,
                'starts_at' => $dto->startsAt,
                'ends_at' => $dto->endsAt,
                'is_published' => $dto->isPublished,
                'created_by' => $actor->id,
            ]);
        });
    }

    public function update(Promotion $promotion, PromotionData $dto): Promotion
    {
        return DB::transaction(function () use ($promotion, $dto) {
            $newImagePath = $dto->image ? $this->imageStorage->store($dto->image, 'promotions') : null;
            $oldImagePath = $promotion->image_path;

            $updated = $this->promotionRepository->update($promotion, [
                'brand_id' => $dto->brandId,
                'title' => $dto->title,
                'description' => $dto->description,
                'image_path' => $newImagePath ?? $oldImagePath,
                'starts_at' => $dto->startsAt,
                'ends_at' => $dto->endsAt,
                'is_published' => $dto->isPublished,
            ]);

            if ($newImagePath && $oldImagePath) {
                $this->imageStorage->delete($oldImagePath);
            }

            return $updated;
        });
    }

    public function delete(Promotion $promotion): void
    {
        DB::transaction(function () use ($promotion) {
            $imagePath = $promotion->image_path;
            $this->promotionRepository->delete($promotion);
            $this->imageStorage->delete($imagePath);
        });
    }
}
