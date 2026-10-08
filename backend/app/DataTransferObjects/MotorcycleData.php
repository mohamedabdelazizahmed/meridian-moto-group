<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

final readonly class MotorcycleData
{
    public function __construct(
        public int $brandId,
        public string $name,
        public ?string $slug,
        public float|string $priceFrom,
        public int $engineCc,
        public int $powerHp,
        public ?string $summary,
        public ?UploadedFile $image,
        public bool $isFeatured,
        public bool $isPublished,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            brandId: (int) $request->input('brand_id'),
            name: $request->string('name')->toString(),
            slug: $request->string('slug')->toString() ?: null,
            priceFrom: $request->input('price_from'),
            engineCc: (int) $request->input('engine_cc'),
            powerHp: (int) $request->input('power_hp'),
            summary: $request->string('summary')->toString() ?: null,
            image: $request->file('image'),
            isFeatured: (bool) $request->boolean('is_featured', false),
            isPublished: (bool) $request->boolean('is_published', true),
        );
    }
}
