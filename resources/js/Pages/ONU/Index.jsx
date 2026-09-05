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
    Eye,
    Pencil,
    Plus,
    Radio,
    RotateCcw,
    Search,
    Trash2,
    Wifi,
} from 'lucide-react';
import { useState } from 'react';

const statusTone = {
    online: 'online',
    offline: 'offline',
    los: 'danger',
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

function SignalValue({ value }) {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return (
            <span className="text-sm text-zinc-400">
                —
            </span>
        );
    }

    const signal = Number(value);

    let className = 'text-teal-700';

    if (signal <= -28) {
        className = 'text-red-600';
    } else if (signal <= -25) {
        className = 'text-amber-600';
    }

    return (
        <span
            className={`text-sm font-semibold ${className}`}
        >
            {signal.toFixed(2)} dBm
        </span>
    );
}

export default function Index({
    onus,
    filters,
    statuses,
    distributionPoints,
}) {
    const { can } = usePermission();
    const [search, setSearch] = useState(
        filters?.search ?? '',
    );

    const [status, setStatus] = useState(
        filters?.status ?? '',
    );

    const [
        distributionPointId,
        setDistributionPointId,
    ] = useState(
        filters?.distribution_point_id ?? '',
    );

    function submit(event) {
        event.preventDefault();

        router.get(
            route('onu-ont.index'),
            {
                ...(search ? { search } : {}),

                ...(status
                    ? { status }
                    : {}),

                ...(distributionPointId
                    ? {
                          distribution_point_id:
                              distributionPointId,
                      }
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
        setDistributionPointId('');

        router.get(
            route('onu-ont.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function deleteOnu(onu) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ONU ${onu.serial_number}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'onu-ont.destroy',
                onu.id,
            ),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="ONU / ONT"
            subtitle="Manage customer-edge optical network devices."
        >
            <Head title="ONU / ONT" />

            <PageHeader
                eyebrow="Customer Edge"
                title="ONU / ONT Management"
                description="Manage optical units, network assignments, signal levels, operational status, and customer connections."
                actions={
                    can('onu.create') ? (
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() =>
                                router.visit(
                                    route(
                                        'onu-ont.create',
                                    ),
                                )
                            }
                        >
                            Add ONU / ONT
                        </Button>
                    ) : null
                }
            />

            <Card
                className="mt-6"
                icon={Radio}
                title="ONU / ONT Inventory"
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
                            placeholder="Search ONU, customer, serial, MAC..."
                        />
                    </div>

                    <select
                        value={
                            distributionPointId
                        }
                        onChange={(event) =>
                            setDistributionPointId(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[240px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">
                            All Distribution Points
                        </option>

                        {distributionPoints.map(
                            (point) => (
                                <option
                                    key={point.id}
                                    value={point.id}
                                >
                                    {point.code} -{' '}
                                    {point.name}
                                </option>
                            ),
                        )}
                    </select>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[150px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
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

                {onus.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1250px] divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            ONU / ONT
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Customer
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Network Path
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Rx Power
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Last Seen
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-right uppercase text-zinc-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {onus.data.map(
                                        (onu) => (
                                            <tr
                                                key={
                                                    onu.id
                                                }
                                                className="transition hover:bg-zinc-50/70"
                                            >
                                                {/* ONU */}
                                                <td className="min-w-[210px] px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-zinc-100">
                                                            <Wifi className="w-4 h-4 text-zinc-700" />
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-semibold text-zinc-950">
                                                                {
                                                                    onu.serial_number
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                {onu.vendor ||
                                                                    'Unknown'}
                                                                {onu.model
                                                                    ? ` / ${onu.model}`
                                                                    : ''}
                                                            </p>

                                                            {onu.mac_address && (
                                                                <p className="mt-1 text-xs text-zinc-400">
                                                                    {
                                                                        onu.mac_address
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Customer */}
                                                <td className="min-w-[180px] px-5 py-4">
                                                    {onu.customer ? (
                                                        <>
                                                            <p className="text-sm font-semibold text-zinc-800">
                                                                {
                                                                    onu
                                                                        .customer
                                                                        .name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                {
                                                                    onu
                                                                        .customer
                                                                        .code
                                                                }
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-zinc-400">
                                                            Unassigned
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Network */}
                                                <td className="min-w-[210px] px-5 py-4">
                                                    {onu.distribution_point ? (
                                                        <>
                                                            <p className="text-sm font-semibold text-zinc-800">
                                                                {onu
                                                                    .distribution_point
                                                                    .splitter
                                                                    ?.pon_port
                                                                    ?.olt
                                                                    ?.code ||
                                                                    '-'}
                                                                {' / '}
                                                                {onu
                                                                    .distribution_point
                                                                    .splitter
                                                                    ?.pon_port
                                                                    ?.name ||
                                                                    '-'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                {onu
                                                                    .distribution_point
                                                                    .code ||
                                                                    '-'}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-zinc-400">
                                                            Unassigned
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Signal */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <SignalValue
                                                        value={
                                                            onu.rx_power
                                                        }
                                                    />
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <StatusBadge
                                                        tone={
                                                            statusTone[
                                                                onu
                                                                    .status
                                                            ] ??
                                                            'neutral'
                                                        }
                                                    >
                                                        {
                                                            onu.status_label
                                                        }
                                                    </StatusBadge>
                                                </td>

                                                {/* Last Seen */}
                                                <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-500">
                                                    {onu.last_seen_at ||
                                                        'Never'}
                                                </td>

                                                {/* Actions */}
                                                <td className="min-w-[250px] whitespace-nowrap px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        {can('onu.view') && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                icon={
                                                                    Eye
                                                                }
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            'onu-ont.show',
                                                                            onu.id,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </Button>
                                                        )}

                                                        {can('onu.update') && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                icon={
                                                                    Pencil
                                                                }
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            'onu-ont.edit',
                                                                            onu.id,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                        )}

                                                        {can('onu.delete') && (
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                icon={
                                                                    Trash2
                                                                }
                                                                onClick={() =>
                                                                    deleteOnu(
                                                                        onu,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={onus.links}
                        />
                    </>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={Radio}
                            title="No ONU / ONT found"
                            description={
                                can('onu.create')
                                    ? 'No device matched the current search or filters.'
                                    : 'No device matched the current search or filters.'
                            }
                            actionLabel={
                                can('onu.create')
                                    ? 'Add ONU / ONT'
                                    : undefined
                            }
                            onAction={
                                can('onu.create')
                                    ? () =>
                                          router.visit(
                                              route(
                                                  'onu-ont.create',
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
