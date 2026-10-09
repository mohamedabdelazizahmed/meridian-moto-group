<?php

declare(strict_types=1);

namespace App\Http\Controllers\Docs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

final class SwaggerUiController extends Controller
{
    public function __invoke(): Response
    {
        if (! config('api-docs.enabled', true)) {
            abort(SymfonyResponse::HTTP_NOT_FOUND);
        }

        return response()->view('docs.swagger');
    }
}
