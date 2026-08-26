<?php

namespace App\Policies;

use App\Models\DistributionPoint;
use App\Models\User;

class DistributionPointPolicy
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
        DistributionPoint $distributionPoint
    ): bool {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(
        User $user,
        DistributionPoint $distributionPoint
    ): bool {
        return $this->isAdmin($user);
    }

    public function delete(
        User $user,
        DistributionPoint $distributionPoint
    ): bool {
        return $this->isAdmin($user);
    }
}
