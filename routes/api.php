<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OltController;


Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working',
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')
    ->prefix('v1')
    ->group(function () {
        Route::get('/olts', [OltController::class, 'index'])
            ->name('api.olts.index');
    });
