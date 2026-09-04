<?php

namespace App\Policies;

use App\Models\Splitter;
use App\Models\User;

class SplitterPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('splitter.view');
    }

    public function view(
        User $user,
        Splitter $splitter
    ): bool {
        return $user->can('splitter.view');
    }

    public function create(User $user): bool
    {
        return $user->can('splitter.create');
    }

    public function update(
        User $user,
        Splitter $splitter
    ): bool {
        return $user->can('splitter.update');
    }

    public function delete(
        User $user,
        Splitter $splitter
    ): bool {
        return $user->can('splitter.delete');
    }
}
