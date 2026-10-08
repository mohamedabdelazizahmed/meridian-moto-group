<?php

declare(strict_types=1);

namespace App\Contracts;

use Illuminate\Http\UploadedFile;

interface ImageStorageInterface
{
    public function store(UploadedFile $file, string $directory): string;

    public function delete(?string $path): void;
}
