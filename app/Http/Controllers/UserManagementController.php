<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $search = trim((string) $request->input('search'));
        $users = User::query()
            ->with('roles:id,name')
            ->when(
                $search,
                fn($query) => $query->where(
                    function ($query) use ($search) {
                        $query
                            ->where(
                                'name',
                                'like',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'email',
                                'like',
                                "%{$search}%"
                            );
                    }
                )
            )
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn(User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,

                'role' => $user
                    ->getRoleNames()
                    ->first(),

                'is_admin' => $user
                    ->hasRole('admin'),
            ]);

        return Inertia::render('User/Index', [
            'users' => $users,

            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', User::class);

        return Inertia::render('User/Create', [
            'roles' => $this->roleOptions(),
        ]);
    }

    public function store(
        Request $request
    ): RedirectResponse {
        Gate::authorize('create', User::class);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'role' => [
                'required',
                'string',
                Rule::exists('roles', 'name')
                    ->where('guard_name', 'web'),
            ],
        ]);

        // Only admin may create another admin.
        if (
            $validated['role'] === 'admin'
            && ! $request->user()->hasRole('admin')
        ) {
            abort(403);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(
                $validated['password']
            ),
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([
            $validated['role'],
        ]);

        return to_route('users.index')
            ->with(
                'success',
                'User created successfully.'
            );
    }

    public function edit(
        User $user
    ): Response {
        Gate::authorize('update', $user);

        return Inertia::render('User/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user
                    ->getRoleNames()
                    ->first(),
            ],

            'roles' => $this->roleOptions(),
        ]);
    }

    public function update(
        Request $request,
        User $user
    ): RedirectResponse {
        Gate::authorize('update', $user);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',

                Rule::unique('users', 'email')
                    ->ignore($user->id),
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],

            'role' => [
                'required',
                'string',

                Rule::exists('roles', 'name')
                    ->where('guard_name', 'web'),
            ],
        ]);

        if (
            $validated['role'] === 'admin'
            && ! $request->user()->hasRole('admin')
        ) {
            abort(403);
        }

        // Prevent a non-admin from modifying admin users.
        if (
            $user->hasRole('admin')
            && ! $request->user()->hasRole('admin')
        ) {
            abort(403);
        }

        // Protect the last admin.
        if (
            $user->hasRole('admin')
            && $validated['role'] !== 'admin'
            && User::role('admin')->count() <= 1
        ) {
            return back()->withErrors([
                'role' =>
                'The last administrator cannot be changed to another role.',
            ]);
        }

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make(
                $validated['password']
            );
        }

        $user->update($data);

        $user->syncRoles([
            $validated['role'],
        ]);

        return to_route('users.index')
            ->with(
                'success',
                'User updated successfully.'
            );
    }

    public function destroy(
        Request $request,
        User $user
    ): RedirectResponse {
        Gate::authorize('delete', $user);

        if ($request->user()->is($user)) {
            return back()->withErrors([
                'user' =>
                'You cannot delete your own account.',
            ]);
        }

        if (
            $user->hasRole('admin')
            && User::role('admin')->count() <= 1
        ) {
            return back()->withErrors([
                'user' =>
                'The last administrator cannot be deleted.',
            ]);
        }

        $user->delete();

        return back()->with(
            'success',
            'User deleted successfully.'
        );
    }

    private function roleOptions()
    {
        return Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);
    }
}
