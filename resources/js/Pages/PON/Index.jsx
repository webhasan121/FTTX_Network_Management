import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { classNames } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import usePermission from '@/Hooks/usePermission';
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
    disabled: 'offline',
};

function formatNumber(value) {
    return Number(value ?? 0).toLocaleString();
}

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
            {links.map((link) => {
                const label = paginationLabel(link.label);

                if (!link.url) {
                    return (
                        <span
                            key={`${label}-disabled`}
                            className="inline-flex items-center px-3 text-sm font-medium border rounded-lg h-9 border-zinc-200 text-zinc-400"
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

export default function Index({
    ports,
    filters,
    statuses,
    olts,
}) {
    const { can } = usePermission();
    const [search, setSearch] = useState(
        filters.search ?? '',
    );

    const [oltId, setOltId] = useState(
        filters.olt_id ?? '',
    );

    const [status, setStatus] = useState(
        filters.status ?? '',
    );

    function submit(event) {
        event.preventDefault();

        router.get(
            route('pon-ports.index'),
            {
                ...(search ? { search } : {}),
                ...(oltId ? { olt_id: oltId } : {}),
                ...(status ? { status } : {}),
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function resetFilters() {
        setSearch('');
        setOltId('');
        setStatus('');

        router.get(
            route('pon-ports.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function deletePort(port) {
        const confirmed = window.confirm(
            `Delete ${port.name}? PON ports with connected splitters cannot be deleted.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route('pon-ports.destroy', port.id),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="PON Ports"
            subtitle="Manage OLT PON port inventory and capacity."
        >
            <Head title="PON Ports" />

            <PageHeader
                eyebrow="Access Layer"
                title="PON Port Management"
                description="Search, filter, review, and maintain PON interfaces connected to network OLTs."
                actions={
                    can('pon.create') ? (
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() =>
                                router.visit(
                                    route('pon-ports.create'),
                                )
                            }
                        >
                            Add PON Port
                        </Button>
                    ) : null
                }
            />

            <Card
                className="mt-6"
                icon={Cable}
                title="PON Port Inventory"
                bodyClassName="p-0"
            >
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-zinc-200 pb-5 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto]"
                >
                    <div className="relative">
                        <Search
                            className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400"
                            aria-hidden="true"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            className="w-full h-10 text-sm rounded-lg shadow-sm border-zinc-300 pl-9 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                            placeholder="Search port name, number, or OLT"
                        />
                    </div>

                    <select
                        value={oltId}
                        onChange={(event) =>
                            setOltId(event.target.value)
                        }
                        className="h-10 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                    >
                        <option value="">
                            All OLTs
                        </option>

                        {olts.map((olt) => (
                            <option
                                key={olt.id}
                                value={olt.id}
                            >
                                {olt.code} - {olt.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                        className="h-10 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                    >
                        <option value="">
                            All statuses
                        </option>

                        {statuses.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
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

                {ports.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            PON Port
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            OLT
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Port Number
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Capacity
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Splitters
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
                                    {ports.data.map((port) => (
                                        <tr key={port.id}>
                                            <td className="px-5 py-4">
                                                <div className="min-w-48">
                                                    <p className="text-sm font-semibold text-zinc-950">
                                                        {port.name}
                                                    </p>

                                                    <p className="mt-1 text-xs font-medium text-zinc-500">
                                                        Updated{' '}
                                                        {port.updated_at}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold whitespace-nowrap text-zinc-700">
                                                    {port.olt.code}
                                                </p>

                                                <p className="mt-1 text-xs whitespace-nowrap text-zinc-500">
                                                    {port.olt.name}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm font-medium whitespace-nowrap text-zinc-700">
                                                #{port.port_number}
                                            </td>

                                            <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-700">
                                                {formatNumber(
                                                    port.capacity,
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-700">
                                                {formatNumber(
                                                    port.splitters_count,
                                                )}
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <StatusBadge
                                                    tone={
                                                        statusTone[
                                                            port
                                                                .status
                                                        ] ??
                                                        'neutral'
                                                    }
                                                >
                                                    {
                                                        port.status_label
                                                    }
                                                </StatusBadge>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    {can('pon.view') && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={Eye}
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        'pon-ports.show',
                                                                        port.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </Button>
                                                    )}

                                                    {can('pon.update') && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={Pencil}
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        'pon-ports.edit',
                                                                        port.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}

                                                    {can('pon.delete') && (
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            icon={Trash2}
                                                            onClick={() =>
                                                                deletePort(
                                                                    port,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={ports.links}
                        />
                    </>
                ) : (
                    <div className="p-5">
                        <EmptyState
                            icon={Cable}
                            title="No PON ports found"
                            description={
                                can('pon.create')
                                    ? 'No PON ports matched the current search or filter. Reset the filters or create a new PON port.'
                                    : 'No PON ports matched the current search or filter.'
                            }
                            actionLabel={
                                can('pon.create')
                                    ? 'Add PON Port'
                                    : undefined
                            }
                            onAction={
                                can('pon.create')
                                    ? () =>
                                          router.visit(
                                              route(
                                                  'pon-ports.create',
                                              ),
                                          )
                                    : undefined
                            }
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
