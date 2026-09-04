import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { classNames } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UserCog,
} from 'lucide-react';
import { useState } from 'react';

function paginationLabel(label) {
    return label
        .replace('&laquo;', 'Previous')
        .replace('&raquo;', 'Next');
}

function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 px-5 py-4">
            {links.map((link) => {
                const label = paginationLabel(link.label);

                if (!link.url) {
                    return (
                        <span
                            key={`${label}-disabled`}
                            className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-400"
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${label}-${link.url}`}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={classNames(
                            'inline-flex h-9 items-center rounded-lg border px-3 text-sm font-semibold transition',
                            link.active
                                ? 'border-zinc-950 bg-zinc-950 text-white'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800',
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}

function formatRole(role) {
    if (!role) {
        return 'No Role';
    }

    return role
        .split('_')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(' ');
}

export default function Index({
    users,
    filters,
}) {
    const [search, setSearch] = useState(
        filters?.search ?? '',
    );

    function submit(event) {
        event.preventDefault();

        router.get(
            route('users.index'),
            {
                ...(search ? { search } : {}),
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function resetFilters() {
        setSearch('');

        router.get(
            route('users.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function deleteUser(user) {
        const confirmed = window.confirm(
            `Delete user "${user.name}"?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route('users.destroy', user.id),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Users"
            subtitle="Manage system users and their assigned roles."
        >
            <Head title="Users" />

            <PageHeader
                eyebrow="Access Control"
                title="User Management"
                description="Create and manage staff accounts, assign roles, and control system access."
                actions={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() =>
                            router.visit(
                                route('users.create'),
                            )
                        }
                    >
                        Add User
                    </Button>
                }
            />

            <Card
                className="mt-6"
                icon={UserCog}
                title="System Users"
                bodyClassName="p-0"
            >
                {/* Search */}
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-zinc-200 p-5 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                    <div className="relative">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                            aria-hidden="true"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value,
                                )
                            }
                            placeholder="Search by name or email"
                            className="h-10 w-full rounded-lg border-zinc-300 pl-9 text-sm text-zinc-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Search}
                        >
                            Search
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            icon={RotateCcw}
                            onClick={resetFilters}
                        >
                            Reset
                        </Button>
                    </div>
                </form>

                {users.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            User
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Role
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-zinc-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-zinc-200 bg-white">
                                    {users.data.map(
                                        (user) => (
                                            <tr
                                                key={
                                                    user.id
                                                }
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="min-w-56">
                                                        <p className="text-sm font-semibold text-zinc-950">
                                                            {
                                                                user.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs font-medium text-zinc-500">
                                                            {
                                                                user.email
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    {user.role ? (
                                                        <span
                                                            className={classNames(
                                                                'inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold',
                                                                user.is_admin
                                                                    ? 'bg-teal-50 text-teal-800'
                                                                    : 'bg-zinc-100 text-zinc-700',
                                                            )}
                                                        >
                                                            {formatRole(
                                                                user.role,
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-zinc-400">
                                                            No
                                                            Role
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        Active
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={
                                                                Pencil
                                                            }
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        'users.edit',
                                                                        user.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>

                                                        {!user.is_admin && (
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                icon={
                                                                    Trash2
                                                                }
                                                                onClick={() =>
                                                                    deleteUser(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}

                                                        {user.is_admin && (
                                                            <span className="inline-flex items-center px-2 text-xs font-medium text-zinc-400">
                                                                Protected
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing{' '}
                                {users.from ?? 0} to{' '}
                                {users.to ?? 0} of{' '}
                                {users.total ?? 0}{' '}
                                users
                            </span>
                        </div>

                        <Pagination
                            links={users.links}
                        />
                    </>
                ) : (
                    <div className="p-5">
                        <EmptyState
                            icon={UserCog}
                            title="No users found"
                            description="Create a system user or adjust the current search filter."
                            actionLabel="Add User"
                            onAction={() =>
                                router.visit(
                                    route(
                                        'users.create',
                                    ),
                                )
                            }
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
