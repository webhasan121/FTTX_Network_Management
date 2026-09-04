import { usePage } from '@inertiajs/react';

export default function usePermission() {
    const { auth } = usePage().props;

    const permissions = auth?.permissions ?? [];
    const roles = auth?.roles ?? [];
    const isAdmin = auth?.is_admin ?? false;

    const can = (permission) => {
        return (
            isAdmin ||
            permissions.includes(permission)
        );
    };

    const hasRole = (role) => {
        return roles.includes(role);
    };

    const canAny = (permissionList = []) => {
        if (isAdmin) {
            return true;
        }

        return permissionList.some((permission) =>
            permissions.includes(permission),
        );
    };

    const canAll = (permissionList = []) => {
        if (isAdmin) {
            return true;
        }

        return permissionList.every((permission) =>
            permissions.includes(permission),
        );
    };

    return {
        can,
        canAny,
        canAll,
        hasRole,
        isAdmin,
        permissions,
        roles,
    };
}
