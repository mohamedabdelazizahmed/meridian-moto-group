<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

final readonly class BrandData
{
    public function __construct(
        public string $name,
        public ?string $slug,
        public string $segment,
        public ?string $tagline,
        public ?string $description,
        public string $accentColor,
        public ?UploadedFile $logo,
        public ?UploadedFile $heroImage,
        public bool $isActive,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->string('name')->toString(),
            slug: $request->string('slug')->toString() ?: null,
            segment: $request->string('segment')->toString(),
            tagline: $request->string('tagline')->toString() ?: null,
            description: $request->string('description')->toString() ?: null,
            accentColor: $request->string('accent_color')->toString(),
            logo: $request->file('logo'),
            heroImage: $request->file('hero_image'),
            isActive: (bool) $request->boolean('is_active', true),
        );
    }
}
