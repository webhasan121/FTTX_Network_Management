<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Role::class);

        $roles = Role::query()
            ->withCount('permissions')
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get();

        return Inertia::render('Role/Index', [
            'roles' => $roles,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Role::class);

        return Inertia::render('Role/Create', [
            'permissions' => Permission::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Role::class);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9]+(?:_[a-z0-9]+)*$/',
                Rule::unique('roles', 'name')
                    ->where('guard_name', 'web'),
            ],

            'permissions' => [
                'array',
            ],

            'permissions.*' => [
                'string',
                Rule::exists('permissions', 'name')
                    ->where('guard_name', 'web'),
            ],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        $role->syncPermissions(
            $validated['permissions'] ?? []
        );

        return to_route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role): Response
    {
        Gate::authorize('update', $role);

        return Inertia::render('Role/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,

                'permissions' => $role
                    ->permissions()
                    ->pluck('name')
                    ->values(),
            ],

            'permissions' => Permission::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(
        Request $request,
        Role $role
    ): RedirectResponse {
        Gate::authorize('update', $role);

        if ($role->name === 'admin') {
            return back()->with(
                'error',
                'The admin role cannot be modified.'
            );
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9]+(?:_[a-z0-9]+)*$/',

                Rule::unique('roles', 'name')
                    ->where('guard_name', 'web')
                    ->ignore($role->id),
            ],

            'permissions' => [
                'array',
            ],

            'permissions.*' => [
                'string',
                Rule::exists('permissions', 'name')
                    ->where('guard_name', 'web'),
            ],
        ]);

        $role->update([
            'name' => $validated['name'],
        ]);

        $role->syncPermissions(
            $validated['permissions'] ?? []
        );

        return to_route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(
        Role $role
    ): RedirectResponse {
        Gate::authorize('delete', $role);

        if ($role->name === 'admin') {
            return back()->with(
                'error',
                'The admin role cannot be deleted.'
            );
        }

        $role->delete();

        return back()->with(
            'success',
            'Role deleted successfully.'
        );
    }
}
