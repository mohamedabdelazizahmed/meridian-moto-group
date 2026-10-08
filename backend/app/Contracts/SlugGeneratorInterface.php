<?php

declare(strict_types=1);

namespace App\Contracts;

interface SlugGeneratorInterface
{
    public function generate(string $name, callable $existsCallback): string;
}
