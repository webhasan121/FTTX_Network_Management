<?php

use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistributionPointController;
use App\Http\Controllers\FaultController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\NetworkMapController;
use App\Http\Controllers\OltController;
use App\Http\Controllers\OnuController;
use App\Http\Controllers\PonPortController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SplitterController;
use App\Http\Controllers\SystemSettingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$networkSections = [

    'settings.index' => [
        'path' => 'settings',
        'title' => 'Settings',
        'eyebrow' => 'System Configuration',
        'description' => 'Centralize application preferences, integrations, and operational defaults.',
    ],
];

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () use ($networkSections) {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('olts', OltController::class);
    Route::resource('pon-ports', PonPortController::class);
    Route::resource('splitters', SplitterController::class);
    Route::resource('distribution-points', DistributionPointController::class);
    Route::resource('onu-ont', OnuController::class)->parameters(['onu-ont' => 'onu',]);
    Route::resource('customers', CustomerController::class);
    Route::resource('connections', ConnectionController::class);
    Route::get('/network-map', [NetworkMapController::class, 'index'])->name('network-map.index');
    Route::resource('faults', FaultController::class);

    foreach ($networkSections as $routeName => $section) {
        Route::get($section['path'], fn() => Inertia::render('NetworkSection', [
            'title' => $section['title'],
            'eyebrow' => $section['eyebrow'],
            'description' => $section['description'],
        ]))->name($routeName);
    }


    Route::get(
        '/settings',
        [SystemSettingController::class, 'index']
    )->name('settings.index');

    Route::put(
        '/settings',
        [SystemSettingController::class, 'update']
    )->name('settings.update');

    Route::get(
        '/global-search',
        GlobalSearchController::class
    )->name('global-search');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
