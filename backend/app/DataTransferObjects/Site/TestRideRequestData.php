<?php

declare(strict_types=1);

namespace App\DataTransferObjects\Site;

use Illuminate\Http\Request;

final readonly class TestRideRequestData
{
    public function __construct(
        public string $name,
        public string $phone,
        public string $email,
        public string $preferredDate,
        public ?string $motorcycleSlug,
        public ?int $motorcycleId,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: trim($request->string('name')->toString()),
            phone: trim($request->string('phone')->toString()),
            email: trim($request->string('email')->toString()),
            preferredDate: trim($request->string('preferred_date')->toString()),
            motorcycleSlug: trim($request->string('motorcycle')->toString()) ?: null,
            motorcycleId: $request->input('resolved_motorcycle_id'),
        );
    }
}
