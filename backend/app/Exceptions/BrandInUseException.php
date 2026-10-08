<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class BrandInUseException extends Exception
{
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage() ?: 'Cannot delete brand that has associated motorcycles or promotions.',
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
