<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user,

                'roles' => $user
                    ? $user->getRoleNames()->values()->all()
                    : [],

                'permissions' => $user
                    ? $user->getAllPermissions()
                        ->pluck('name')
                        ->values()
                        ->all()
                    : [],

                'is_admin' => $user
                    ? $user->hasRole('admin')
                    : false,
            ],

            'flash' => [
                'id' => fn (): ?string =>
                    $request->session()->hasAny([
                        'success',
                        'error',
                        'warning',
                        'info',
                    ])
                        ? Str::uuid()->toString()
                        : null,

                'success' => fn (): ?string =>
                    $request->session()->get('success'),

                'error' => fn (): ?string =>
                    $request->session()->get('error'),

                'warning' => fn (): ?string =>
                    $request->session()->get('warning'),

                'info' => fn (): ?string =>
                    $request->session()->get('info'),
            ],
        ];
    }
}
