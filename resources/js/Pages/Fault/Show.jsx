import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import PageHeader from "@/Components/UI/PageHeader";
import StatusBadge from "@/Components/UI/StatusBadge";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import usePermission from '@/Hooks/usePermission';
import {
    AlertTriangle,
    ArrowLeft,
    Clock,
    MapPin,
    Pencil,
    Server,
    Trash2,
    User,
    Wrench,
} from "lucide-react";

const statusTone = {
    open: "critical",
    in_progress: "warning",
    resolved: "online",
};

const severityTone = {
    low: "neutral",
    medium: "info",
    high: "warning",
    critical: "critical",
};

function detailValue(value, fallback = "Not set") {
    return value === null || value === undefined || value === ""
        ? fallback
        : value;
}

function DetailItem({ label, value }) {
    return (
        <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">
                {label}
            </dt>

            <dd className="mt-2 text-sm font-medium text-zinc-950">
                {detailValue(value)}
            </dd>
        </div>
    );
}

export default function Show({ fault }) {
    const { can } = usePermission();
    function deleteFault() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${fault.title}"?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(route("faults.destroy", fault.id));
    }

    function viewAsset() {
        if (!fault.asset) {
            return;
        }

        router.visit(route(fault.asset.route, fault.asset.id));
    }

    return (
        <AuthenticatedLayout
            title={`Fault #${fault.id}`}
            subtitle="Network incident details and resolution tracking."
        >
            <Head title={fault.title} />

            <PageHeader
                eyebrow="Network Operations"
                title={fault.title}
                description={
                    fault.description || "Network fault incident record."
                }
                meta={
                    <>
                        <StatusBadge
                            tone={severityTone[fault.severity] ?? "neutral"}
                        >
                            {fault.severity_label}
                        </StatusBadge>

                        <StatusBadge
                            tone={statusTone[fault.status] ?? "neutral"}
                        >
                            {fault.status_label}
                        </StatusBadge>

                        <StatusBadge tone="info">
                            {fault.fault_type_label}
                        </StatusBadge>
                    </>
                }
                actions={
                    <>
                        <Button
                            variant="secondary"
                            icon={ArrowLeft}
                            onClick={() => router.visit(route("faults.index"))}
                        >
                            Back
                        </Button>

                        {can("fault.update") && (
                            <Button
                                variant="secondary"
                                icon={Pencil}
                                onClick={() =>
                                    router.visit(route("faults.edit", fault.id))
                                }
                            >
                                Edit
                            </Button>
                        )}

                        {can("fault.delete") && (
                            <Button
                                variant="danger"
                                icon={Trash2}
                                onClick={deleteFault}
                            >
                                Delete
                            </Button>
                        )}
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card
                    title="Incident Information"
                    description="Fault classification and current operational state."
                    icon={AlertTriangle}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem label="Fault ID" value={`#${fault.id}`} />

                        <DetailItem
                            label="Fault Type"
                            value={fault.fault_type_label}
                        />

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                Severity
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={
                                        severityTone[fault.severity] ??
                                        "neutral"
                                    }
                                >
                                    {fault.severity_label}
                                </StatusBadge>
                            </dd>
                        </div>

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                Status
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={statusTone[fault.status] ?? "neutral"}
                                >
                                    {fault.status_label}
                                </StatusBadge>
                            </dd>
                        </div>

                        <DetailItem
                            label="Reported"
                            value={fault.reported_at_formatted}
                        />

                        <DetailItem
                            label="Resolved"
                            value={fault.resolved_at_formatted}
                        />
                    </dl>

                    <div className="pt-5 mt-6 border-t border-zinc-200">
                        <DetailItem
                            label="Description"
                            value={
                                fault.description ||
                                "No additional description."
                            }
                        />
                    </div>
                </Card>

                <Card
                    title="Assignment"
                    description="Operator responsible for this incident."
                    icon={User}
                >
                    {fault.assigned_user ? (
                        <div className="p-4 border rounded-xl border-zinc-200 bg-zinc-50">
                            <p className="text-xs font-semibold uppercase text-zinc-500">
                                Assigned To
                            </p>

                            <p className="mt-2 text-base font-semibold text-zinc-950">
                                {fault.assigned_user.name}
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                {fault.assigned_user.email}
                            </p>
                        </div>
                    ) : (
                        <div className="p-5 text-center border border-dashed rounded-xl border-zinc-300 bg-zinc-50">
                            <Wrench className="mx-auto h-7 w-7 text-zinc-300" />

                            <p className="mt-3 text-sm font-semibold text-zinc-700">
                                Unassigned
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                                No operator is assigned to this fault yet.
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid gap-6 mt-6 xl:grid-cols-2">
                <Card
                    title="Affected Network Asset"
                    description="Primary infrastructure associated with the incident."
                    icon={Server}
                >
                    {fault.asset ? (
                        <>
                            <div className="p-5 border rounded-xl border-zinc-200 bg-zinc-50">
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    {fault.asset.type}
                                </p>

                                <p className="mt-2 text-lg font-semibold text-zinc-950">
                                    {fault.asset.name}
                                </p>
                            </div>

                            <Button
                                className="mt-4"
                                variant="secondary"
                                onClick={viewAsset}
                            >
                                View Network Asset
                            </Button>
                        </>
                    ) : (
                        <div className="p-5 border border-dashed rounded-xl border-zinc-300 bg-zinc-50">
                            <p className="text-sm text-zinc-500">
                                This is a general fault and is not linked to a
                                specific network asset.
                            </p>
                        </div>
                    )}
                </Card>

                <Card
                    title="Incident Timeline"
                    description="Lifecycle timestamps for the fault."
                    icon={Clock}
                >
                    <div className="relative ml-2 space-y-4 border-l-2 border-zinc-200 pl-7">
                        {/* Reported */}
                        <div className="relative">
                            <span className="absolute -left-[37px] top-1 block h-4 w-4 rounded-full border-4 border-white bg-red-500 ring-1 ring-red-200" />

                            <p className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
                                Reported
                            </p>

                            <p className="mt-1 text-sm font-semibold text-zinc-950">
                                {fault.reported_at_formatted || "Not set"}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Fault was reported to the network operations
                                team.
                            </p>
                        </div>

                        {/* In Progress */}
                        {fault.status === "in_progress" && (
                            <div className="relative">
                                <span className="absolute -left-[37px] top-1 block h-4 w-4 rounded-full border-4 border-white bg-amber-500 ring-1 ring-amber-200" />

                                <p className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
                                    In Progress
                                </p>

                                <p className="mt-1 text-sm font-semibold text-zinc-950">
                                    Investigation in progress
                                </p>

                                <p className="mt-1 text-xs leading-5 text-zinc-500">
                                    The incident is currently being investigated
                                    or repaired.
                                </p>
                            </div>
                        )}

                        {/* Resolved */}
                        {fault.status === "resolved" && (
                            <div className="relative">
                                <span className="absolute -left-[37px] top-1 block h-4 w-4 rounded-full border-4 border-white bg-emerald-500 ring-1 ring-emerald-200" />

                                <p className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
                                    Resolved
                                </p>

                                <p className="mt-1 text-sm font-semibold text-zinc-950">
                                    {fault.resolved_at_formatted || "Resolved"}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-zinc-500">
                                    Network service has been restored and the
                                    incident is closed.
                                </p>
                            </div>
                        )}
                    </div>

                    {fault.status === "open" && (
                        <div className="px-4 py-3 mt-5 border border-red-100 rounded-lg bg-red-50">
                            <p className="text-sm font-semibold text-red-700">
                                Awaiting investigation
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            <Card className="mt-6" title="Record Metadata" icon={MapPin}>
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem
                        label="Created"
                        value={fault.created_at_formatted}
                    />

                    <DetailItem
                        label="Updated"
                        value={fault.updated_at_formatted}
                    />

                    <DetailItem
                        label="Fault Type"
                        value={fault.fault_type_label}
                    />

                    <DetailItem
                        label="Asset"
                        value={fault.asset?.name || "General"}
                    />
                </dl>
            </Card>
        </AuthenticatedLayout>
    );
}
