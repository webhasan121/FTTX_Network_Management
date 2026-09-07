<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CannotDeleteOltException extends Exception
{
    public function render(
        Request $request
    ): JsonResponse|RedirectResponse {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => $this->getMessage(),
            ], 409);
        }

        return back()->with(
            'error',
            $this->getMessage()
        );
    }
}
