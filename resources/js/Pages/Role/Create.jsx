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

export default function Create({ permissions }) {
    const groupedPermissions =
        groupPermissions(permissions);

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: '',
        permissions: [],
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

    function submit(event) {
        event.preventDefault();

        post(route('roles.store'));
    }

    return (
        <AuthenticatedLayout
            title="Create Role"
            subtitle="Create a role and assign permissions."
        >
            <Head title="Create Role" />

            <PageHeader
                eyebrow="Access Control"
                title="Create Role"
                description="Create a new role and select the system permissions available to it."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(route('roles.index'))
                        }
                    >
                        Back
                    </Button>
                }
            />

            <form onSubmit={submit}>
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
                            <p className="mt-2 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </label>
                </Card>

                <Card
                    className="mt-6"
                    icon={ShieldCheck}
                    title="Permissions"
                >
                    <div className="space-y-6">
                        {Object.entries(
                            groupedPermissions,
                        ).map(
                            ([
                                module,
                                modulePermissions,
                            ]) => (
                                <div key={module}>
                                    <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase text-zinc-500">
                                        {module}
                                    </h3>

                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        {modulePermissions.map(
                                            (permission) => (
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
                            ),
                        )}
                    </div>

                    {errors.permissions && (
                        <p className="mt-4 text-sm text-red-600">
                            {errors.permissions}
                        </p>
                    )}
                </Card>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            router.visit(route('roles.index'))
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
                            ? 'Creating...'
                            : 'Create Role'}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
