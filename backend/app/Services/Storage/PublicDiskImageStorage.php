<?php

declare(strict_types=1);

namespace App\Services\Storage;

use App\Contracts\ImageStorageInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class PublicDiskImageStorage implements ImageStorageInterface
{
    public function store(UploadedFile $file, string $directory): string
    {
        /** @var string */
        return $file->store($directory, 'public');
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
