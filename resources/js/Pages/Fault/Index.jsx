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
    AlertTriangle,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const statusTone = {
    open: 'critical',
    in_progress: 'warning',
    resolved: 'online',
};

const severityTone = {
    low: 'neutral',
    medium: 'info',
    high: 'warning',
    critical: 'critical',
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
    faults,
    filters,
    statuses,
    severities,
    faultTypes,
}) {
    const { can } = usePermission();
    const [search, setSearch] = useState(
        filters?.search ?? '',
    );

    const [status, setStatus] = useState(
        filters?.status ?? '',
    );

    const [severity, setSeverity] = useState(
        filters?.severity ?? '',
    );

    const [faultType, setFaultType] = useState(
        filters?.fault_type ?? '',
    );

    function submit(event) {
        event.preventDefault();

        router.get(
            route('faults.index'),
            {
                ...(search ? { search } : {}),
                ...(status ? { status } : {}),
                ...(severity ? { severity } : {}),
                ...(faultType
                    ? { fault_type: faultType }
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
        setSeverity('');
        setFaultType('');

        router.get(
            route('faults.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function deleteFault(fault) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${fault.title}"?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route('faults.destroy', fault.id),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Faults"
            subtitle="Track FTTX network incidents and resolution progress."
        >
            <Head title="Faults" />

            <PageHeader
                eyebrow="Network Operations"
                title="Fault Management"
                description="Report, prioritize, assign, track, and resolve faults across OLT, PON, distribution, and ONU infrastructure."
                actions={
                    can('fault.create') ? (
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() =>
                                router.visit(
                                    route('faults.create'),
                                )
                            }
                        >
                            Report Fault
                        </Button>
                    ) : null
                }
            />

            <Card
                className="mt-6"
                title="Fault Register"
                icon={AlertTriangle}
                bodyClassName="p-0"
            >
                <form
                    onSubmit={submit}
                    className="flex flex-wrap items-center gap-3 pb-5 border-b border-zinc-200"
                >
                    <div className="relative min-w-[240px] flex-1">
                        <Search className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value,
                                )
                            }
                            placeholder="Search fault or network asset..."
                            className="w-full h-10 pr-3 text-sm bg-white border rounded-lg shadow-sm border-zinc-300 pl-9 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                        />
                    </div>

                    <select
                        value={faultType}
                        onChange={(event) =>
                            setFaultType(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[170px] rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    >
                        <option value="">
                            All Fault Types
                        </option>

                        {faultTypes.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={severity}
                        onChange={(event) =>
                            setSeverity(
                                event.target.value,
                            )
                        }
                        className="h-10 w-[150px] rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    >
                        <option value="">
                            All Severity
                        </option>

                        {severities.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
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
                        className="h-10 w-[160px] rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
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

                    <div className="flex gap-2 shrink-0">
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

                {faults.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1200px] divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Fault
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Asset
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Severity
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Assigned To
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Reported
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-right uppercase text-zinc-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {faults.data.map(
                                        (fault) => (
                                            <tr
                                                key={fault.id}
                                                className="hover:bg-zinc-50/70"
                                            >
                                                <td className="min-w-[240px] px-5 py-4">
                                                    <p className="text-sm font-semibold text-zinc-950">
                                                        {fault.title}
                                                    </p>

                                                    <p className="mt-1 text-xs text-zinc-500">
                                                        {
                                                            fault.fault_type_label
                                                        }
                                                    </p>
                                                </td>

                                                <td className="min-w-[180px] px-5 py-4">
                                                    {fault.asset ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            fault
                                                                                .asset
                                                                                .route,
                                                                            fault
                                                                                .asset
                                                                                .id,
                                                                        ),
                                                                    )
                                                                }
                                                                className="text-sm font-semibold text-zinc-800 hover:text-teal-700"
                                                            >
                                                                {
                                                                    fault
                                                                        .asset
                                                                        .name
                                                                }
                                                            </button>

                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                {
                                                                    fault
                                                                        .asset
                                                                        .type
                                                                }
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-zinc-400">
                                                            General fault
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <StatusBadge
                                                        tone={
                                                            severityTone[
                                                                fault
                                                                    .severity
                                                            ] ??
                                                            'neutral'
                                                        }
                                                    >
                                                        {
                                                            fault.severity_label
                                                        }
                                                    </StatusBadge>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <StatusBadge
                                                        tone={
                                                            statusTone[
                                                                fault
                                                                    .status
                                                            ] ??
                                                            'neutral'
                                                        }
                                                    >
                                                        {
                                                            fault.status_label
                                                        }
                                                    </StatusBadge>
                                                </td>

                                                <td className="min-w-[160px] px-5 py-4 text-sm text-zinc-700">
                                                    {fault.assigned_user
                                                        ?.name ||
                                                        'Unassigned'}
                                                </td>

                                                <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-500">
                                                    {fault.reported_at ||
                                                        'Not set'}
                                                </td>

                                                <td className="min-w-[250px] whitespace-nowrap px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        {can('fault.view') && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                icon={Eye}
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            'faults.show',
                                                                            fault.id,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </Button>
                                                        )}

                                                        {can('fault.update') && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                icon={Pencil}
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            'faults.edit',
                                                                            fault.id,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                        )}

                                                        {can('fault.delete') && (
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                icon={Trash2}
                                                                onClick={() =>
                                                                    deleteFault(
                                                                        fault,
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
                            links={faults.links}
                        />
                    </>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={AlertTriangle}
                            title="No faults found"
                            description="No network faults matched the current filters."
                            actionLabel={
                                can('fault.create')
                                    ? 'Report Fault'
                                    : undefined
                            }
                            onAction={
                                can('fault.create')
                                    ? () =>
                                          router.visit(
                                              route('faults.create'),
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
