<?php

namespace App\Policies;

use App\Models\DistributionPoint;
use App\Models\User;

class DistributionPointPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('distribution-point.view');
    }

    public function view(
        User $user,
        DistributionPoint $distributionPoint
    ): bool {
        return $user->can('distribution-point.view');
    }

    public function create(User $user): bool
    {
        return $user->can('distribution-point.create');
    }

    public function update(
        User $user,
        DistributionPoint $distributionPoint
    ): bool {
        return $user->can('distribution-point.update');
    }

    public function delete(
        User $user,
        DistributionPoint $distributionPoint
    ): bool {
        return $user->can('distribution-point.delete');
    }
}
