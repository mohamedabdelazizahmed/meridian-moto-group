<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class CannotDeleteSelfException extends Exception
{
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage() ?: 'Admins cannot delete their own account.',
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
