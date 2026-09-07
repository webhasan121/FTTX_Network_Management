<?php

namespace App\Policies;

use App\Models\Olt;
use App\Models\User;

class OltPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('olt.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Olt $olt): bool
    {
        return $user->can('olt.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('olt.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Olt $olt): bool
    {
        return $user->can('olt.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Olt $olt): bool
    {
        return $user->can('olt.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Olt $olt): bool
    {
        return $user->can('olt.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Olt $olt): bool
    {
        return $user->can('olt.force-delete');
    }



}
