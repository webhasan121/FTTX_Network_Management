<?php

use App\Http\Controllers\Api\OltController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->prefix('v1')
    ->name('api.')
    ->group(function () {

        Route::get('/olts/trash', [OltController::class, 'trash'])
            ->name('olts.trash');

        Route::patch('/olts/{id}/restore', [OltController::class, 'restore'])
            ->name('olts.restore');

        Route::delete('/olts/{id}/force-delete', [OltController::class, 'forceDelete'])
            ->name('olts.force-delete');

        Route::apiResource('olts', OltController::class);
    });
