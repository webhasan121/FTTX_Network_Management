<?php

namespace App\Policies;

use App\Models\Fault;
use App\Models\User;

class FaultPolicy
{
    private function isAdmin(
        User $user
    ): bool {
        return $user->role === 'admin';
    }

    public function viewAny(
        User $user
    ): bool {
        return $this->isAdmin($user);
    }

    public function view(
        User $user,
        Fault $fault
    ): bool {
        return $this->isAdmin($user);
    }

    public function create(
        User $user
    ): bool {
        return $this->isAdmin($user);
    }

    public function update(
        User $user,
        Fault $fault
    ): bool {
        return $this->isAdmin($user);
    }

    public function delete(
        User $user,
        Fault $fault
    ): bool {
        return $this->isAdmin($user);
    }
}
