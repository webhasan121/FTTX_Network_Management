<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
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
        Customer $customer
    ): bool {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(
        User $user,
        Customer $customer
    ): bool {
        return $this->isAdmin($user);
    }

    public function delete(
        User $user,
        Customer $customer
    ): bool {
        return $this->isAdmin($user);
    }
}
