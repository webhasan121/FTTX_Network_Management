<?php

namespace App\Policies;

use App\Models\Fault;
use App\Models\User;

class FaultPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('fault.view');
    }

    public function view(
        User $user,
        Fault $fault
    ): bool {
        return $user->can('fault.view');
    }

    public function create(User $user): bool
    {
        return $user->can('fault.create');
    }

    public function update(
        User $user,
        Fault $fault
    ): bool {
        return $user->can('fault.update');
    }

    public function delete(
        User $user,
        Fault $fault
    ): bool {
        return $user->can('fault.delete');
    }
}
