<?php

namespace App\Policies;

use App\Models\Onu;
use App\Models\User;

class OnuPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('onu.view');
    }

    public function view(
        User $user,
        Onu $onu
    ): bool {
        return $user->can('onu.view');
    }

    public function create(User $user): bool
    {
        return $user->can('onu.create');
    }

    public function update(
        User $user,
        Onu $onu
    ): bool {
        return $user->can('onu.update');
    }

    public function delete(
        User $user,
        Onu $onu
    ): bool {
        return $user->can('onu.delete');
    }
}
