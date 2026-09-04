import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    ShieldCheck,
} from 'lucide-react';

function groupPermissions(permissions) {
    return permissions.reduce((groups, permission) => {
        const module =
            permission.name.split('.')[0] ?? 'other';

        if (!groups[module]) {
            groups[module] = [];
        }

        groups[module].push(permission);

        return groups;
    }, {});
}

export default function Edit({
    role,
    permissions,
}) {
    const groupedPermissions =
        groupPermissions(permissions);

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        name: role.name,
        permissions: role.permissions ?? [],
    });

    function togglePermission(name) {
        if (data.permissions.includes(name)) {
            setData(
                'permissions',
                data.permissions.filter(
                    (permission) => permission !== name,
                ),
            );

            return;
        }

        setData('permissions', [
            ...data.permissions,
            name,
        ]);
    }

    function selectModulePermissions(
        modulePermissions,
    ) {
        const names = modulePermissions.map(
            (permission) => permission.name,
        );

        const allSelected = names.every((name) =>
            data.permissions.includes(name),
        );

        if (allSelected) {
            setData(
                'permissions',
                data.permissions.filter(
                    (permission) =>
                        !names.includes(permission),
                ),
            );

            return;
        }

        setData(
            'permissions',
            Array.from(
                new Set([
                    ...data.permissions,
                    ...names,
                ]),
            ),
        );
    }

    function submit(event) {
        event.preventDefault();

        put(route('roles.update', role.id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            title="Edit Role"
            subtitle="Update role information and permissions."
        >
            <Head title={`Edit ${role.name}`} />

            <PageHeader
                eyebrow="Access Control"
                title="Edit Role"
                description="Update the role name and control which system permissions are assigned to it."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route('roles.index'),
                            )
                        }
                    >
                        Back
                    </Button>
                }
            />

            <form onSubmit={submit}>
                {/* Role Details */}
                <Card
                    className="mt-6"
                    icon={ShieldCheck}
                    title="Role Details"
                >
                    <label className="block">
                        <span className="text-sm font-semibold text-zinc-700">
                            Role Name
                        </span>

                        <input
                            type="text"
                            value={data.name}
                            onChange={(event) =>
                                setData(
                                    'name',
                                    event.target.value,
                                )
                            }
                            placeholder="network_engineer"
                            className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                        />

                        {errors.name && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                                {errors.name}
                            </p>
                        )}

                        <p className="mt-2 text-xs text-zinc-500">
                            Use lowercase letters and
                            underscores. Example:
                            network_engineer
                        </p>
                    </label>
                </Card>

                {/* Permissions */}
                <Card
                    className="mt-6"
                    icon={ShieldCheck}
                    title="Role Permissions"
                >
                    {Object.keys(groupedPermissions)
                        .length > 0 ? (
                        <div className="space-y-7">
                            {Object.entries(
                                groupedPermissions,
                            ).map(
                                ([
                                    module,
                                    modulePermissions,
                                ]) => {
                                    const allSelected =
                                        modulePermissions.every(
                                            (
                                                permission,
                                            ) =>
                                                data.permissions.includes(
                                                    permission.name,
                                                ),
                                        );

                                    return (
                                        <div
                                            key={module}
                                            className="border rounded-xl border-zinc-200"
                                        >
                                            {/* Module Header */}
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                                                <div>
                                                    <h3 className="text-sm font-semibold capitalize text-zinc-900">
                                                        {
                                                            module
                                                        }
                                                    </h3>

                                                    <p className="mt-0.5 text-xs text-zinc-500">
                                                        {
                                                            modulePermissions.length
                                                        }{' '}
                                                        permissions
                                                    </p>
                                                </div>

                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            allSelected
                                                        }
                                                        onChange={() =>
                                                            selectModulePermissions(
                                                                modulePermissions,
                                                            )
                                                        }
                                                        className="text-teal-600 rounded border-zinc-300 focus:ring-teal-500"
                                                    />

                                                    <span className="text-xs font-semibold text-zinc-600">
                                                        Select
                                                        All
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Permission Items */}
                                            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                                                {modulePermissions.map(
                                                    (
                                                        permission,
                                                    ) => (
                                                        <label
                                                            key={
                                                                permission.id
                                                            }
                                                            className="flex items-center gap-3 p-3 transition border rounded-lg cursor-pointer border-zinc-200 hover:border-teal-200 hover:bg-teal-50"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={data.permissions.includes(
                                                                    permission.name,
                                                                )}
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        permission.name,
                                                                    )
                                                                }
                                                                className="text-teal-600 rounded border-zinc-300 focus:ring-teal-500"
                                                            />

                                                            <span className="text-sm font-medium text-zinc-700">
                                                                {
                                                                    permission.name
                                                                }
                                                            </span>
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500">
                            No permissions are available.
                            Create permissions first.
                        </p>
                    )}

                    {errors.permissions && (
                        <p className="mt-4 text-sm font-medium text-red-600">
                            {errors.permissions}
                        </p>
                    )}
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            router.visit(
                                route('roles.index'),
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        icon={Save}
                        disabled={processing}
                    >
                        {processing
                            ? 'Saving...'
                            : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
