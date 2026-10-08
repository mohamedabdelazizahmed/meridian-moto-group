<?php

declare(strict_types=1);

namespace App\Http\Resources\Site\Concerns;

use Illuminate\Support\Facades\Storage;

trait HasImageUrl
{
    protected function imageUrl(?string $path): ?string
    {
        return $path ? Storage::disk('public')->url($path) : null;
    }
}
