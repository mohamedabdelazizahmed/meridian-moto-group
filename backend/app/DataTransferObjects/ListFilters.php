<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Http\Request;

final readonly class ListFilters
{
    public function __construct(
        public ?string $search,
        public ?int $brandId,
        public ?string $status,
        public int $perPage,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            search: $request->string('search')->toString() ?: null,
            brandId: $request->filled('brand_id') ? (int) $request->input('brand_id') : null,
            status: $request->string('status')->toString() ?: null,
            perPage: (int) $request->input('per_page', 15),
        );
    }
}
