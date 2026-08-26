<?php

namespace App\Policies;

use App\Models\Connection;
use App\Models\User;

class ConnectionPolicy
{
    private function isAdmin(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function viewAny(
        User $user
    ): bool {
        return $this->isAdmin($user);
    }

    public function view(
        User $user,
        Connection $connection
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
        Connection $connection
    ): bool {
        return $this->isAdmin($user);
    }

    public function delete(
        User $user,
        Connection $connection
    ): bool {
        return $this->isAdmin($user);
    }
}
