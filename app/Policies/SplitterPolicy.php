<?php

namespace App\Policies;

use App\Models\Splitter;
use App\Models\User;

class SplitterPolicy
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
        Splitter $splitter
    ): bool {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(
        User $user,
        Splitter $splitter
    ): bool {
        return $this->isAdmin($user);
    }

    public function delete(
        User $user,
        Splitter $splitter
    ): bool {
        return $this->isAdmin($user);
    }
}
