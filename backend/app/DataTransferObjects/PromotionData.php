<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

final readonly class PromotionData
{
    public function __construct(
        public int $brandId,
        public string $title,
        public ?string $description,
        public ?UploadedFile $image,
        public string $startsAt,
        public string $endsAt,
        public bool $isPublished,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            brandId: (int) $request->input('brand_id'),
            title: $request->string('title')->toString(),
            description: $request->string('description')->toString() ?: null,
            image: $request->file('image'),
            startsAt: $request->string('starts_at')->toString(),
            endsAt: $request->string('ends_at')->toString(),
            isPublished: (bool) $request->boolean('is_published', true),
        );
    }
}
