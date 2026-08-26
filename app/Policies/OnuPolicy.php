<?php

namespace App\Policies;

use App\Models\Onu;
use App\Models\User;

class OnuPolicy
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
        Onu $onu
    ): bool {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(
        User $user,
        Onu $onu
    ): bool {
        return $this->isAdmin($user);
    }

    public function delete(
        User $user,
        Onu $onu
    ): bool {
        return $this->isAdmin($user);
    }
}
