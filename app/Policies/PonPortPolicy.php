<?php

namespace App\Policies;

use App\Models\PonPort;
use App\Models\User;

class PonPortPolicy
{
    private function isAdmin(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(
        User $user,
        PonPort $ponPort
    ): bool {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(
        User $user,
        PonPort $ponPort
    ): bool {
        return $this->isAdmin($user);
    }

    public function delete(
        User $user,
        PonPort $ponPort
    ): bool {
        return $this->isAdmin($user);
    }
}
