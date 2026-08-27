import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { classNames } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
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
    points,
    filters,
    splitters,
    types,
}) {
    const [search, setSearch] = useState(
        filters?.search ?? '',
    );

    const [splitterId, setSplitterId] = useState(
        filters?.splitter_id ?? '',
    );

    const [type, setType] = useState(
        filters?.type ?? '',
    );

    function submit(event) {
        event.preventDefault();

        router.get(
            route('distribution-points.index'),
            {
                ...(search ? { search } : {}),
                ...(splitterId
                    ? { splitter_id: splitterId }
                    : {}),
                ...(type ? { type } : {}),
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
        setSplitterId('');
        setType('');

        router.get(
            route('distribution-points.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function deletePoint(point) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${point.code}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'distribution-points.destroy',
                point.id,
            ),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Distribution Points"
            subtitle="Manage FDB, FAT, NAP, and ODP network nodes."
        >
            <Head title="Distribution Points" />

            <PageHeader
                eyebrow="Field Network"
                title="Distribution Point Management"
                description="Manage downstream fiber distribution nodes, port utilization, splitter assignments, and field locations."
                actions={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() =>
                            router.visit(
                                route(
                                    'distribution-points.create',
                                ),
                            )
                        }
                    >
                        Add Distribution Point
                    </Button>
                }
            />

            <Card
                className="mt-6"
                icon={Box}
                title="Distribution Inventory"
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
                            placeholder="Search distribution points..."
                        />
                    </div>

                    <select
                        value={splitterId}
                        onChange={(event) =>
                            setSplitterId(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[230px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">
                            All Splitters
                        </option>

                        {splitters.map((splitter) => (
                            <option
                                key={splitter.id}
                                value={splitter.id}
                            >
                                {splitter.code} /{' '}
                                {splitter.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={(event) =>
                            setType(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[150px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">
                            All Types
                        </option>

                        {types.map((item) => (
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
                {points.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-[1150px] w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Distribution Point
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Type
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Upstream
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Ports
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            ONUs
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Location
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-right uppercase text-zinc-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {points.data.map((point) => {
                                        const total =
                                            Number(
                                                point.total_ports ??
                                                    0,
                                            );

                                        const used =
                                            Number(
                                                point.used_ports ??
                                                    0,
                                            );

                                        const available =
                                            Math.max(
                                                total - used,
                                                0,
                                            );

                                        return (
                                            <tr
                                                key={point.id}
                                                className="transition hover:bg-zinc-50/70"
                                            >
                                                <td className="min-w-[220px] px-5 py-4">
                                                    <p className="text-sm font-semibold text-zinc-950">
                                                        {point.name}
                                                    </p>

                                                    <p className="mt-1 text-xs font-medium text-zinc-500">
                                                        {point.code}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <StatusBadge tone="info">
                                                        {String(
                                                            point.type,
                                                        ).toUpperCase()}
                                                    </StatusBadge>
                                                </td>

                                                <td className="min-w-[190px] px-5 py-4">
                                                    <p className="text-sm font-semibold whitespace-nowrap text-zinc-800">
                                                        {point
                                                            .splitter
                                                            ?.code ||
                                                            '-'}
                                                    </p>

                                                    <p className="mt-1 text-xs whitespace-nowrap text-zinc-500">
                                                        {point
                                                            .splitter
                                                            ?.pon_port
                                                            ?.olt
                                                            ?.code ||
                                                            '-'}
                                                        {' / '}
                                                        {point
                                                            .splitter
                                                            ?.pon_port
                                                            ?.name ||
                                                            '-'}
                                                    </p>
                                                </td>

                                                <td className="min-w-[120px] whitespace-nowrap px-5 py-4">
                                                    <p className="text-sm font-semibold text-zinc-800">
                                                        {used} /{' '}
                                                        {total}
                                                    </p>

                                                    <p className="mt-1 text-xs font-medium text-teal-700">
                                                        {available}{' '}
                                                        free
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-zinc-100 px-2.5 py-1.5 text-sm font-semibold text-zinc-700">
                                                        {
                                                            point.onus_count
                                                        }
                                                    </span>
                                                </td>

                                                <td className="min-w-[180px] px-5 py-4 text-sm text-zinc-600">
                                                    {point.location_name ||
                                                        'Unassigned'}
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
                                                                        'distribution-points.show',
                                                                        point.id,
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
                                                                        'distribution-points.edit',
                                                                        point.id,
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
                                                                deletePoint(
                                                                    point,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <Pagination links={points.links} />
                    </>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={Box}
                            title="No distribution points found"
                            description="No distribution point matched the current search or filters."
                            actionLabel="Add Distribution Point"
                            onAction={() =>
                                router.visit(
                                    route(
                                        'distribution-points.create',
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
