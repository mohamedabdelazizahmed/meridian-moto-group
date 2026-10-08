<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class SeedAssets
{
    /**
     * Copy a seed asset from database/seed-assets to the public storage disk under seed/...
     * Note: These are placeholders to be replaced with real images later.
     */
    public static function get(string $relativePath): string
    {
        $sourcePath = database_path('seed-assets/'.$relativePath);
        $storagePath = 'seed/'.$relativePath;

        if (file_exists($sourcePath)) {
            $content = file_get_contents($sourcePath);
            Storage::disk('public')->put($storagePath, $content);
        }

        return $storagePath;
    }
}
