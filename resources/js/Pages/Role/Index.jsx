import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import usePermission from '@/Hooks/usePermission';
import {
    Pencil,
    Plus,
    ShieldCheck,
    Trash2,
} from 'lucide-react';

export default function Index({ roles }) {
    const { can } = usePermission();
    function deleteRole(role) {
        if (role.name === 'admin') {
            return;
        }

        const confirmed = window.confirm(
            `Delete role "${role.name}"?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route('roles.destroy', role.id),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Roles"
            subtitle="Manage roles and their permissions."
        >
            <Head title="Roles" />

            <PageHeader
                eyebrow="Access Control"
                title="Role Management"
                description="Create roles and control which permissions each role can access."
                actions={
                    can('role.create') ? (
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() =>
                                router.visit(route('roles.create'))
                            }
                        >
                            Add Role
                        </Button>
                    ) : null
                }
            />

            <Card
                className="mt-6"
                icon={ShieldCheck}
                title="System Roles"
                bodyClassName="p-0"
            >
                {roles.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Role
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Permissions
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Guard
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-right uppercase text-zinc-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-zinc-200">
                                {roles.map((role) => (
                                    <tr key={role.id}>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-semibold text-zinc-950">
                                                {role.name}
                                            </p>

                                            {role.name === 'admin' && (
                                                <p className="mt-1 text-xs font-medium text-teal-700">
                                                    System administrator
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-700">
                                            {role.permissions_count}
                                        </td>

                                        <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-500">
                                            {role.guard_name}
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap">
                                            {role.name === 'admin' ? (
                                                <p className="text-xs font-medium text-right text-zinc-400">
                                                    Protected
                                                </p>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    {can('role.update') && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={Pencil}
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        'roles.edit',
                                                                        role.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}

                                                    {can('role.delete') && (
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            icon={Trash2}
                                                            onClick={() =>
                                                                deleteRole(
                                                                    role,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-5">
                        <EmptyState
                            icon={ShieldCheck}
                            title="No roles found"
                            description={
                                can('role.create')
                                    ? 'Create a role and assign permissions to it.'
                                    : 'No roles are available.'
                            }
                            actionLabel={
                                can('role.create')
                                    ? 'Add Role'
                                    : undefined
                            }
                            onAction={
                                can('role.create')
                                    ? () =>
                                          router.visit(route('roles.create'))
                                    : undefined
                            }
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
