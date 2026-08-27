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
    Server,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const statusTone = {
    online: 'online',
    offline: 'offline',
    maintenance: 'maintenance',
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

export default function Index({ olts, filters, statuses }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    function submit(event) {
        event.preventDefault();

        router.get(
            route('olts.index'),
            {
                ...(search ? { search } : {}),
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
        setStatus('');
        router.get(route('olts.index'), {}, { preserveState: true, replace: true });
    }

    function deleteOlt(olt) {
        const confirmed = window.confirm(
            `Delete ${olt.code}? This will also remove connected PON topology records linked to this OLT.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(route('olts.destroy', olt.id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            title="OLTs"
            subtitle="Manage optical line terminal inventory and status."
        >
            <Head title="OLTs" />

            <PageHeader
                eyebrow="Optical Line Terminals"
                title="OLT Management check auto deployment latest"
                description="Search, filter, review, and maintain OLT inventory for the access network."
                actions={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => router.visit(route('olts.create'))}
                    >
                        Add OLT
                    </Button>
                }
            />

            <Card className="mt-6" icon={Server} title="OLT Inventory" bodyClassName="p-0">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-zinc-200 p-5 lg:grid-cols-[minmax(0,1fr)_220px_auto]"
                >
                    <div className="relative">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-10 w-full rounded-lg border-zinc-300 pl-9 text-sm text-zinc-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            placeholder="Search by name, code, vendor, IP, or location"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-10 rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                        <Button type="submit" variant="primary" icon={Search}>
                            Search
                        </Button>
                        <Button type="button" variant="secondary" icon={RotateCcw} onClick={resetFilters}>
                            Reset
                        </Button>
                    </div>
                </form>

                {olts.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            OLT
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Vendor / Model
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            IP Address
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Location
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            PON Ports
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
                                    {olts.data.map((olt) => (
                                        <tr key={olt.id}>
                                            <td className="px-5 py-4">
                                                <div className="min-w-56">
                                                    <p className="text-sm font-semibold text-zinc-950">
                                                        {olt.name}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-zinc-500">
                                                        {olt.code}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-700">
                                                {olt.vendor} / {olt.model}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-zinc-700">
                                                {olt.ip_address}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                                                {olt.location_name ?? 'Unassigned'}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-700">
                                                {formatNumber(olt.pon_ports_count)} / {formatNumber(olt.total_pon_ports)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <StatusBadge tone={statusTone[olt.status] ?? 'neutral'}>
                                                    {olt.status_label}
                                                </StatusBadge>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        icon={Eye}
                                                        onClick={() => router.visit(route('olts.show', olt.id))}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        icon={Pencil}
                                                        onClick={() => router.visit(route('olts.edit', olt.id))}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        icon={Trash2}
                                                        onClick={() => deleteOlt(olt)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {formatNumber(olts.from)} to {formatNumber(olts.to)} of {formatNumber(olts.total)} OLTs
                            </span>
                        </div>
                        <Pagination links={olts.links} />
                    </>
                ) : (
                    <div className="p-5">
                        <EmptyState
                            icon={Server}
                            title="No OLTs found"
                            description="Create an OLT or adjust the current search and status filters."
                            actionLabel="Add OLT"
                            onAction={() => router.visit(route('olts.create'))}
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
