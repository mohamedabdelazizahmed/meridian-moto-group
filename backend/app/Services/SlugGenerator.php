<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\SlugGeneratorInterface;
use Illuminate\Support\Str;

final class SlugGenerator implements SlugGeneratorInterface
{
    public function generate(string $name, callable $existsCallback): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 2;

        while ($existsCallback($slug)) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
