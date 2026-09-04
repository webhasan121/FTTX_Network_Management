import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    KeyRound,
    Pencil,
    Plus,
    Save,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ permissions }) {
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
    });

    function submit(event) {
        event.preventDefault();

        post(route('permissions.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    function startEdit(permission) {
        setEditingId(permission.id);
        setEditingName(permission.name);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditingName('');
    }

    function updatePermission(permission) {
        router.put(
            route('permissions.update', permission.id),
            {
                name: editingName,
            },
            {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            },
        );
    }

    function deletePermission(permission) {
        const confirmed = window.confirm(
            `Delete permission "${permission.name}"?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route('permissions.destroy', permission.id),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Permissions"
            subtitle="Manage system permissions and access actions."
        >
            <Head title="Permissions" />

            <PageHeader
                eyebrow="Access Control"
                title="Permission Management"
                description="Create and manage permissions used to control access across roles and system modules."
            />

            {/* Create Permission */}
            <Card
                className="mt-6"
                icon={KeyRound}
                title="Create Permission"
            >
                <form
                    onSubmit={submit}
                    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                    <div>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            placeholder="Example: olt.create"
                            className="h-10 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        />

                        {errors.name && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                                {errors.name}
                            </p>
                        )}

                        <p className="mt-2 text-xs text-zinc-500">
                            Recommended format: module.action
                            — for example olt.view, onu.create,
                            customer.update.
                        </p>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Plus}
                            disabled={processing}
                        >
                            {processing
                                ? 'Creating...'
                                : 'Add Permission'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Permission List */}
            <Card
                className="mt-6"
                icon={KeyRound}
                title="Permission List"
                bodyClassName="p-0"
            >
                {permissions.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            ID
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Permission
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Guard
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-zinc-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-zinc-200 bg-white">
                                    {permissions.map((permission) => (
                                        <tr key={permission.id}>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                                                {permission.id}
                                            </td>

                                            <td className="px-5 py-4">
                                                {editingId ===
                                                permission.id ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            editingName
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            setEditingName(
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        className="h-10 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                                    />
                                                ) : (
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-950">
                                                            {
                                                                permission.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            System
                                                            permission
                                                        </p>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                                                {
                                                    permission.guard_name
                                                }
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {editingId ===
                                                    permission.id ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="primary"
                                                                icon={
                                                                    Save
                                                                }
                                                                onClick={() =>
                                                                    updatePermission(
                                                                        permission,
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                icon={X}
                                                                onClick={
                                                                    cancelEdit
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                icon={
                                                                    Pencil
                                                                }
                                                                onClick={() =>
                                                                    startEdit(
                                                                        permission,
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                icon={
                                                                    Trash2
                                                                }
                                                                onClick={() =>
                                                                    deletePermission(
                                                                        permission,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-zinc-200 px-5 py-4 text-sm text-zinc-500">
                            Total {permissions.length}{' '}
                            permissions
                        </div>
                    </>
                ) : (
                    <div className="p-5">
                        <EmptyState
                            icon={KeyRound}
                            title="No permissions found"
                            description="Create your first permission to start building role-based access control."
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
