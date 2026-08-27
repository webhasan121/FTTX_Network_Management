import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { classNames } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import {
    Cable,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const statusTone = {
    active: 'online',
    inactive: 'neutral',
    disconnected: 'offline',
};

const onuTone = {
    online: 'online',
    offline: 'offline',
    los: 'critical',
    disabled: 'neutral',
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
    connections,
    filters,
    statuses,
    customers,
}) {
    const [search, setSearch] = useState(
        filters?.search ?? '',
    );

    const [status, setStatus] = useState(
        filters?.status ?? '',
    );

    const [customerId, setCustomerId] = useState(
        filters?.customer_id ?? '',
    );

    function submit(event) {
        event.preventDefault();

        router.get(
            route('connections.index'),
            {
                ...(search ? { search } : {}),
                ...(status ? { status } : {}),
                ...(customerId
                    ? { customer_id: customerId }
                    : {}),
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
        setCustomerId('');

        router.get(
            route('connections.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function deleteConnection(connection) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${connection.connection_code}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'connections.destroy',
                connection.id,
            ),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Connections"
            subtitle="Manage customer-to-ONU FTTX service assignments."
        >
            <Head title="Connections" />

            <PageHeader
                eyebrow="Service Provisioning"
                title="Connection Management"
                description="Link customers with ONU / ONT devices and review the complete FTTX service path."
                actions={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() =>
                            router.visit(
                                route(
                                    'connections.create',
                                ),
                            )
                        }
                    >
                        Add Connection
                    </Button>
                }
            />

            <Card
                className="mt-6"
                title="Connection Inventory"
                icon={Cable}
                bodyClassName="p-0"
            >
                {/* Filters */}
                <form
                    onSubmit={submit}
                    className="flex flex-wrap items-center gap-3 pb-5 border-b border-zinc-200"
                >
                    <div className="relative min-w-[250px] flex-1">
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
                            placeholder="Search connection, customer, ONU..."
                        />
                    </div>

                    <select
                        value={customerId}
                        onChange={(event) =>
                            setCustomerId(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[220px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">
                            All Customers
                        </option>

                        {customers.map((customer) => (
                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.customer_code} -{' '}
                                {customer.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[160px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">
                            All Statuses
                        </option>

                        {statuses.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
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

                {/* Table */}
                {connections.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1250px] divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Connection
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Customer
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            ONU / ONT
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Network Path
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Signal
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
                                    {connections.data.map(
                                        (connection) => {
                                            const onu =
                                                connection.onu;

                                            const point =
                                                onu?.distribution_point;

                                            const splitter =
                                                point?.splitter;

                                            const pon =
                                                splitter?.pon_port;

                                            const olt =
                                                pon?.olt;

                                            return (
                                                <tr
                                                    key={
                                                        connection.id
                                                    }
                                                    className="transition hover:bg-zinc-50/70"
                                                >
                                                    <td className="min-w-[170px] px-5 py-4">
                                                        <p className="text-sm font-semibold text-zinc-950">
                                                            {
                                                                connection.connection_code
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            ID #
                                                            {
                                                                connection.id
                                                            }
                                                        </p>
                                                    </td>

                                                    <td className="min-w-[200px] px-5 py-4">
                                                        <p className="text-sm font-semibold text-zinc-800">
                                                            {connection
                                                                .customer
                                                                ?.name ||
                                                                '-'}
                                                        </p>

                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            {connection
                                                                .customer
                                                                ?.customer_code ||
                                                                '-'}
                                                        </p>
                                                    </td>

                                                    <td className="min-w-[210px] px-5 py-4">
                                                        <p className="text-sm font-semibold text-zinc-800">
                                                            {onu?.serial_number ||
                                                                '-'}
                                                        </p>

                                                        <div className="mt-2">
                                                            <StatusBadge
                                                                tone={
                                                                    onuTone[
                                                                        onu
                                                                            ?.status
                                                                    ] ??
                                                                    'neutral'
                                                                }
                                                            >
                                                                {onu?.status ||
                                                                    'Unknown'}
                                                            </StatusBadge>
                                                        </div>
                                                    </td>

                                                    <td className="min-w-[230px] px-5 py-4">
                                                        <p className="text-sm font-semibold text-zinc-800">
                                                            {olt?.code ||
                                                                '-'}
                                                            {' / '}
                                                            {pon?.name ||
                                                                '-'}
                                                        </p>

                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            {splitter?.code ||
                                                                '-'}
                                                            {' → '}
                                                            {point?.code ||
                                                                '-'}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        {onu?.rx_power !==
                                                            null &&
                                                        onu?.rx_power !==
                                                            undefined ? (
                                                            <span className="text-sm font-semibold text-teal-700">
                                                                {
                                                                    onu.rx_power
                                                                }{' '}
                                                                dBm
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-zinc-400">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        <StatusBadge
                                                            tone={
                                                                statusTone[
                                                                    connection
                                                                        .status
                                                                ] ??
                                                                'neutral'
                                                            }
                                                        >
                                                            {
                                                                connection.status
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
                                                                            'connections.show',
                                                                            connection.id,
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
                                                                            'connections.edit',
                                                                            connection.id,
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
                                                                    deleteConnection(
                                                                        connection,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={connections.links}
                        />
                    </>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={Cable}
                            title="No connections found"
                            description="No FTTX connection matched the current search or filters."
                            actionLabel="Add Connection"
                            onAction={() =>
                                router.visit(
                                    route(
                                        'connections.create',
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
