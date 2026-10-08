<?php

declare(strict_types=1);

namespace App\DataTransferObjects\Site;

use Illuminate\Http\Request;

final readonly class MotorcycleCatalogFilters
{
    public function __construct(
        public ?bool $featured,
        public ?string $brandSlug,
        public int $perPage,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $featured = $request->has('featured') ? (bool) $request->boolean('featured') : null;
        $brandSlug = $request->string('brand')->toString() ?: null;
        $perPage = (int) $request->input('per_page', 12);
        $perPage = max(1, min(50, $perPage));

        return new self(
            featured: $featured,
            brandSlug: $brandSlug,
            perPage: $perPage,
        );
    }
}
