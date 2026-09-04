<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Gate;

class PermissionController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Permission::class);

        $permissions = Permission::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('Permission/Index', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Permission::class);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+([._-][a-z0-9]+)*$/',
                'unique:permissions,name',
            ],
        ]);

        Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        return back()->with(
            'success',
            'Permission created successfully.'
        );
    }

    public function update(
        Request $request,
        Permission $permission
    ): RedirectResponse {

        Gate::authorize('update', $permission);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+([._-][a-z0-9]+)*$/',
                'unique:permissions,name,' . $permission->id,
            ],
        ]);

        $permission->update([
            'name' => $validated['name'],
        ]);

        return back()->with(
            'success',
            'Permission updated successfully.'
        );
    }

    public function destroy(
        Permission $permission
    ): RedirectResponse {

        Gate::authorize('delete', $permission);

        $permission->delete();

        return back()->with(
            'success',
            'Permission deleted successfully.'
        );
    }
}
