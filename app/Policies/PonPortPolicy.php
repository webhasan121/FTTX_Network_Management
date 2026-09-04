<?php

namespace App\Policies;

use App\Models\PonPort;
use App\Models\User;

class PonPortPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('pon.view');
    }

    public function view(
        User $user,
        PonPort $ponPort
    ): bool {
        return $user->can('pon.view');
    }

    public function create(User $user): bool
    {
        return $user->can('pon.create');
    }

    public function update(
        User $user,
        PonPort $ponPort
    ): bool {
        return $user->can('pon.update');
    }

    public function delete(
        User $user,
        PonPort $ponPort
    ): bool {
        return $user->can('pon.delete');
    }
}
