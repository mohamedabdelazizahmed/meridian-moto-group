<?php

declare(strict_types=1);

namespace App\Http\Controllers\Docs;

use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

final class OpenApiSpecController extends Controller
{
    public function __invoke(): BinaryFileResponse
    {
        if (! config('api-docs.enabled', true)) {
            abort(SymfonyResponse::HTTP_NOT_FOUND);
        }

        $specPath = config('api-docs.spec_path');

        if (! file_exists($specPath)) {
            abort(SymfonyResponse::HTTP_NOT_FOUND);
        }

        return response()->file($specPath, [
            'Content-Type' => 'application/yaml',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
