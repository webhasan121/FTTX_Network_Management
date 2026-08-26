import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { classNames } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import {
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const statusTone = {
    active: 'online',
    inactive: 'neutral',
};

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
        <div className="flex flex-wrap items-center justify-end gap-2 px-5 py-4 border-t border-zinc-200">
            {links.map((link, index) => {
                const label = paginationLabel(link.label);

                if (!link.url) {
                    return (
                        <span
                            key={`${label}-${index}`}
                            className="inline-flex items-center px-3 text-sm font-medium border rounded-lg h-9 border-zinc-200 text-zinc-400"
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${label}-${index}`}
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

export default function Index({
    customers,
    filters,
    statuses,
}) {
    const [search, setSearch] = useState(
        filters?.search ?? '',
    );

    const [status, setStatus] = useState(
        filters?.status ?? '',
    );

    function submit(event) {
        event.preventDefault();

        router.get(
            route('customers.index'),
            {
                ...(search ? { search } : {}),
                ...(status ? { status } : {}),
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function resetFilters() {
        setSearch('');
        setStatus('');

        router.get(
            route('customers.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function deleteCustomer(customer) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${customer.name}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'customers.destroy',
                customer.id,
            ),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Customers"
            subtitle="Manage FTTX subscribers and customer records."
        >
            <Head title="Customers" />

            <PageHeader
                eyebrow="Subscriber Management"
                title="Customer Management"
                description="Manage subscriber information, contact details, service areas, and network connection status."
                actions={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() =>
                            router.visit(
                                route(
                                    'customers.create',
                                ),
                            )
                        }
                    >
                        Add Customer
                    </Button>
                }
            />

            <Card
                className="mt-6"
                title="Customer Directory"
                icon={Users}
                bodyClassName="p-0"
            >
                {/* Filters */}
                <form
                    onSubmit={submit}
                    className="flex flex-wrap items-center gap-3 p-5 border-b border-zinc-200"
                >
                    <div className="relative min-w-[260px] flex-1">
                        <Search
                            className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400"
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
                            className="w-full h-10 pr-3 text-sm transition bg-white border rounded-lg shadow-sm outline-none border-zinc-300 pl-9 text-zinc-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            placeholder="Search customer, phone, area..."
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[170px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">
                            All Statuses
                        </option>

                        {statuses.map(
                            (item) => (
                                <option
                                    key={
                                        item.value
                                    }
                                    value={
                                        item.value
                                    }
                                >
                                    {item.label}
                                </option>
                            ),
                        )}
                    </select>

                    <div className="flex items-center gap-2 shrink-0">
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

                {customers.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1100px] divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Customer
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Contact
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Area
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Connections
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-right uppercase text-zinc-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {customers.data.map(
                                        (customer) => (
                                            <tr
                                                key={
                                                    customer.id
                                                }
                                                className="transition hover:bg-zinc-50/70"
                                            >
                                                <td className="min-w-[220px] px-5 py-4">
                                                    <p className="text-sm font-semibold text-zinc-950">
                                                        {
                                                            customer.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs font-medium text-zinc-500">
                                                        {
                                                            customer.customer_code
                                                        }
                                                    </p>
                                                </td>

                                                <td className="min-w-[210px] px-5 py-4">
                                                    <p className="text-sm font-medium text-zinc-700">
                                                        {customer.phone ||
                                                            'No phone'}
                                                    </p>

                                                    <p className="mt-1 text-xs text-zinc-500">
                                                        {customer.email ||
                                                            'No email'}
                                                    </p>
                                                </td>

                                                <td className="min-w-[170px] px-5 py-4">
                                                    <p className="text-sm text-zinc-700">
                                                        {customer.area ||
                                                            'Unassigned'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-zinc-100 px-2.5 py-1.5 text-sm font-semibold text-zinc-700">
                                                            {
                                                                customer.connections_count
                                                            }
                                                        </span>

                                                        {customer.active_connections_count >
                                                            0 && (
                                                            <span className="text-xs font-medium text-teal-700">
                                                                {
                                                                    customer.active_connections_count
                                                                }{' '}
                                                                active
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <StatusBadge
                                                        tone={
                                                            statusTone[
                                                                customer
                                                                    .status
                                                            ] ??
                                                            'neutral'
                                                        }
                                                    >
                                                        {
                                                            customer.status
                                                        }
                                                    </StatusBadge>
                                                </td>

                                                <td className="min-w-[250px] whitespace-nowrap px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={
                                                                Eye
                                                            }
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        'customers.show',
                                                                        customer.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={
                                                                Pencil
                                                            }
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        'customers.edit',
                                                                        customer.id,
                                                                    ),
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
                                                                deleteCustomer(
                                                                    customer,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={
                                customers.links
                            }
                        />
                    </>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={Users}
                            title="No customers found"
                            description="No customer matched the current search or filters."
                            actionLabel="Add Customer"
                            onAction={() =>
                                router.visit(
                                    route(
                                        'customers.create',
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
