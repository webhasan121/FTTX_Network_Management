<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Dashboard
            'dashboard.view',

            // OLT
            'olt.view',
            'olt.create',
            'olt.update',
            'olt.delete',
            'olt.restore',
            'olt.force-delete',

            // PON Port
            'pon.view',
            'pon.create',
            'pon.update',
            'pon.delete',

            // Splitter
            'splitter.view',
            'splitter.create',
            'splitter.update',
            'splitter.delete',

            // Distribution Point
            'distribution-point.view',
            'distribution-point.create',
            'distribution-point.update',
            'distribution-point.delete',

            // ONU / ONT
            'onu.view',
            'onu.create',
            'onu.update',
            'onu.delete',

            // Customer
            'customer.view',
            'customer.create',
            'customer.update',
            'customer.delete',

            // Connection
            'connection.view',
            'connection.create',
            'connection.update',
            'connection.delete',

            // Fault
            'fault.view',
            'fault.create',
            'fault.update',
            'fault.delete',

            // Network Map
            'network-map.view',

            // User Management
            'user.view',
            'user.create',
            'user.update',
            'user.delete',

            // Role Management
            'role.view',
            'role.create',
            'role.update',
            'role.delete',

            // Permission Management
            'permission.view',
            'permission.create',
            'permission.update',
            'permission.delete',

            // Settings
            'settings.view',
            'settings.update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}
