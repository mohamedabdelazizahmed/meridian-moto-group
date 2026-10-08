<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\RoleName;
use Illuminate\Http\Request;

final readonly class UserData
{
    /**
     * @param  array<int>  $brandIds
     */
    public function __construct(
        public string $name,
        public string $email,
        public ?string $password,
        public RoleName $role,
        public array $brandIds,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $role = RoleName::from($request->string('role')->toString());
        $brandIds = $role === RoleName::Admin
            ? []
            : array_map('intval', (array) $request->input('brand_ids', []));

        return new self(
            name: $request->string('name')->toString(),
            email: $request->string('email')->toString(),
            password: $request->string('password')->toString() ?: null,
            role: $role,
            brandIds: $brandIds,
        );
    }
}
