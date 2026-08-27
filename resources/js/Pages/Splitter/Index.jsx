import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import EmptyState from "@/Components/UI/EmptyState";
import PageHeader from "@/Components/UI/PageHeader";
import StatusBadge from "@/Components/UI/StatusBadge";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { classNames } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import {
    Eye,
    GitBranch,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from "lucide-react";
import { useState } from "react";

function paginationLabel(label) {
    return label.replace("&laquo;", "Previous").replace("&raquo;", "Next");
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
                            "inline-flex h-9 items-center rounded-lg border px-3 text-sm font-semibold transition",
                            link.active
                                ? "border-zinc-950 bg-zinc-950 text-white"
                                : "border-zinc-200 bg-white text-zinc-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800",
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}

export default function Index({ splitters, filters, ponPorts, ratios }) {
    const [search, setSearch] = useState(filters?.search ?? "");

    const [ponPortId, setPonPortId] = useState(filters?.pon_port_id ?? "");

    const [ratio, setRatio] = useState(filters?.ratio ?? "");

    function submit(event) {
        event.preventDefault();

        router.get(
            route("splitters.index"),
            {
                ...(search ? { search } : {}),

                ...(ponPortId ? { pon_port_id: ponPortId } : {}),

                ...(ratio ? { ratio } : {}),
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function resetFilters() {
        setSearch("");
        setPonPortId("");
        setRatio("");

        router.get(
            route("splitters.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function deleteSplitter(splitter) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${splitter.code}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(route("splitters.destroy", splitter.id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            title="Splitters"
            subtitle="Manage passive optical splitter inventory."
        >
            <Head title="Splitters" />

            <PageHeader
                eyebrow="Passive Optical Network"
                title="Splitter Management"
                description="Manage splitter ratios, upstream PON assignments, port utilization, and field locations."
                actions={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => router.visit(route("splitters.create"))}
                    >
                        Add Splitter
                    </Button>
                }
            />

            <Card
                className="mt-6"
                icon={GitBranch}
                title="Splitter Inventory"
                bodyClassName="p-0"
            >
                {/* Filters */}
                <form
                    onSubmit={submit}
                    className="flex flex-wrap items-center gap-3 pb-5 border-b border-zinc-200"
                >
                    {/* Search */}
                    <div className="relative min-w-[260px] flex-1">
                        <Search
                            className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400"
                            aria-hidden="true"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full h-10 pr-3 text-sm transition bg-white border rounded-lg shadow-sm outline-none border-zinc-300 pl-9 text-zinc-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            placeholder="Search splitters..."
                        />
                    </div>

                    {/* PON Filter */}
                    <select
                        value={ponPortId}
                        onChange={(event) => setPonPortId(event.target.value)}
                        className="h-10 w-[220px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">All PON Ports</option>

                        {ponPorts.map((port) => (
                            <option key={port.id} value={port.id}>
                                {port.olt?.code} / {port.name}
                            </option>
                        ))}
                    </select>

                    {/* Ratio Filter */}
                    <select
                        value={ratio}
                        onChange={(event) => setRatio(event.target.value)}
                        className="h-10 w-[150px] rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                        <option value="">All Ratios</option>

                        {ratios.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button type="submit" variant="primary" icon={Search}>
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
                {splitters.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-[1100px] w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Splitter
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Upstream
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Ratio
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Ports
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold tracking-wide text-left uppercase text-zinc-500">
                                            Distribution
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
                                    {splitters.data.map((splitter) => {
                                        const totalPorts = Number(
                                            splitter.total_ports ?? 0,
                                        );

                                        const usedPorts = Number(
                                            splitter.used_ports ?? 0,
                                        );

                                        const availablePorts = Math.max(
                                            totalPorts - usedPorts,
                                            0,
                                        );

                                        return (
                                            <tr
                                                key={splitter.id}
                                                className="transition hover:bg-zinc-50/70"
                                            >
                                                {/* Splitter */}
                                                <td className="min-w-[220px] px-5 py-4 align-middle">
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-950">
                                                            {splitter.name}
                                                        </p>

                                                        <p className="mt-1 text-xs font-medium text-zinc-500">
                                                            {splitter.code}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Upstream */}
                                                <td className="min-w-[170px] px-5 py-4 align-middle">
                                                    <p className="text-sm font-semibold whitespace-nowrap text-zinc-800">
                                                        {splitter.pon_port?.olt
                                                            ?.code || "-"}
                                                    </p>

                                                    <p className="mt-1 text-xs whitespace-nowrap text-zinc-500">
                                                        {splitter.pon_port
                                                            ?.name || "-"}
                                                    </p>
                                                </td>

                                                {/* Ratio */}
                                                <td className="px-5 py-4 align-middle whitespace-nowrap">
                                                    <StatusBadge tone="info">
                                                        {splitter.ratio}
                                                    </StatusBadge>
                                                </td>

                                                {/* Ports */}
                                                <td className="min-w-[120px] whitespace-nowrap px-5 py-4 align-middle">
                                                    <p className="text-sm font-semibold text-zinc-800">
                                                        {usedPorts} /{" "}
                                                        {totalPorts}
                                                    </p>

                                                    <p className="mt-1 text-xs font-medium text-teal-700">
                                                        {availablePorts} free
                                                    </p>
                                                </td>

                                                {/* Distribution */}
                                                <td className="px-5 py-4 align-middle whitespace-nowrap">
                                                    <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-zinc-100 px-2.5 py-1.5 text-sm font-semibold text-zinc-700">
                                                        {
                                                            splitter.distribution_points_count
                                                        }
                                                    </span>
                                                </td>

                                                {/* Location */}
                                                <td className="min-w-[180px] px-5 py-4 align-middle text-sm text-zinc-600">
                                                    {splitter.location_name ||
                                                        "Unassigned"}
                                                </td>

                                                {/* Actions */}
                                                <td className="min-w-[250px] whitespace-nowrap px-5 py-4 align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={Eye}
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "splitters.show",
                                                                        splitter.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={Pencil}
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "splitters.edit",
                                                                        splitter.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            icon={Trash2}
                                                            onClick={() =>
                                                                deleteSplitter(
                                                                    splitter,
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

                        <Pagination links={splitters.links} />
                    </>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={GitBranch}
                            title="No splitters found"
                            description="No splitter matched the current search or filters. Reset the filters or add a new splitter."
                            actionLabel="Add Splitter"
                            onAction={() =>
                                router.visit(route("splitters.create"))
                            }
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
