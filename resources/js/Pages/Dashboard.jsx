import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import ProgressBar from '@/Components/UI/ProgressBar';
import StatCard from '@/Components/UI/StatCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    Cable,
    ChartColumn,
    ChartPie,
    CircleCheck,
    CircleX,
    GitBranch,
    Radio,
    RefreshCw,
    Router,
    Server,
    ShieldAlert,
    Signal,
    TriangleAlert,
    Users,
    Wifi,
    WifiOff,
} from 'lucide-react';

const statIcons = {
    Server,
    Cable,
    GitBranch,
    Radio,
    Wifi,
    WifiOff,
    Users,
    TriangleAlert,
};

const defaultSnapshot = {
    onlineRate: 0,
    offlineDevices: 0,
    criticalFaults: 0,
    averagePonLoad: 0,
};

const formatNumber = (value = 0) => Number(value ?? 0).toLocaleString();

const formatPercent = (value = 0) =>
    `${Number(value ?? 0).toLocaleString(undefined, {
        maximumFractionDigits: 1,
    })}%`;

function utilizationTone(percentage) {
    if (percentage >= 90) {
        return 'danger';
    }

    if (percentage >= 75) {
        return 'warning';
    }

    if (percentage >= 60) {
        return 'info';
    }

    return 'success';
}

function statusTone(status) {
    if (status === 'Critical' || status === 'Escalated' || status === 'Open') {
        return 'critical';
    }

    if (status === 'Major' || status === 'Warning' || status === 'Investigating') {
        return 'warning';
    }

    if (status === 'Assigned' || status === 'Monitoring') {
        return 'info';
    }

    return 'neutral';
}

function OnuStatusChart({ segments }) {
    const total = segments.reduce(
        (sum, segment) => sum + Number(segment.value ?? 0),
        0,
    );
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    if (total <= 0) {
        return (
            <EmptyState
                icon={ChartPie}
                title="No ONU status data"
                description="ONU/ONT status distribution will appear after devices are added."
            />
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
            <div className="relative mx-auto h-56 w-56">
                <svg className="h-full w-full" viewBox="0 0 120 120" role="img">
                    <title>ONU status overview</title>
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#f4f4f5"
                        strokeWidth="16"
                    />
                    {segments.map((segment) => {
                        const dashLength = (segment.value / total) * circumference;
                        const strokeDashoffset = -offset;
                        offset += dashLength;

                        return (
                            <circle
                                key={segment.label}
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="16"
                                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                transform="rotate(-90 60 60)"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-semibold text-zinc-950">
                        {formatNumber(total)}
                    </span>
                    <span className="mt-1 text-xs font-medium uppercase text-zinc-500">
                        ONU/ONT
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {segments.map((segment) => (
                    <div key={segment.label} className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-zinc-950">
                                        {segment.label}
                                    </p>
                                    <StatusBadge tone={segment.tone}>
                                        {formatPercent(segment.percentage)}
                                    </StatusBadge>
                                </div>
                                <p className="mt-1 text-sm text-zinc-500">
                                    {formatNumber(segment.value)} devices
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Dashboard({
    stats = [],
    onuStatus = [],
    ponUtilization = [],
    recentFaults = [],
    offlineOnus = [],
    snapshot = defaultSnapshot,
    lastUpdated,
}) {
    const dashboardSnapshot = { ...defaultSnapshot, ...snapshot };
    const updatedLabel = lastUpdated
        ? `Updated ${new Date(lastUpdated).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })}`
        : 'Awaiting data';

    return (
        <AuthenticatedLayout
            title="Dashboard"
            subtitle="Live NOC overview from the FTTX network database."
        >
            <Head title="Dashboard" />

            <PageHeader
                eyebrow="Network Operations Center"
                title="FTTX Dashboard"
                description="Monitor access-network health, PON capacity, ONU availability, and active service-impacting faults from one clean operational view."
                meta={
                    <>
                        <StatusBadge tone="info">NOC summary</StatusBadge>
                        <StatusBadge tone="neutral">{updatedLabel}</StatusBadge>
                    </>
                }
                actions={
                    <Button
                        icon={RefreshCw}
                        variant="secondary"
                        onClick={() => window.location.reload()}
                    >
                        Refresh
                    </Button>
                }
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.key ?? stat.label}
                        label={stat.label}
                        value={formatNumber(stat.value)}
                        detail={stat.detail}
                        icon={statIcons[stat.icon]}
                        tone={stat.tone}
                    />
                ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <Card
                    title="ONU Status Overview"
                    description="Current online and offline distribution across provisioned ONU/ONT devices."
                    icon={ChartPie}
                >
                    <OnuStatusChart segments={onuStatus} />
                </Card>

                <Card
                    title="NOC Snapshot"
                    description="Fast operational signals for the current monitoring window."
                    icon={Activity}
                >
                    <div className="space-y-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <CircleCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                                <span className="text-sm font-medium text-zinc-600">
                                    Online rate
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-zinc-950">
                                {formatPercent(dashboardSnapshot.onlineRate)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <CircleX className="h-5 w-5 text-red-600" aria-hidden="true" />
                                <span className="text-sm font-medium text-zinc-600">
                                    Offline devices
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-zinc-950">
                                {formatNumber(dashboardSnapshot.offlineDevices)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="h-5 w-5 text-amber-600" aria-hidden="true" />
                                <span className="text-sm font-medium text-zinc-600">
                                    Critical faults
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-zinc-950">
                                {formatNumber(dashboardSnapshot.criticalFaults)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Signal className="h-5 w-5 text-cyan-600" aria-hidden="true" />
                                <span className="text-sm font-medium text-zinc-600">
                                    Average PON load
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-zinc-950">
                                {formatPercent(dashboardSnapshot.averagePonLoad)}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <Card
                    title="PON Utilization"
                    description="Highest watched PON ports by assigned ONU count."
                    icon={ChartColumn}
                >
                    {ponUtilization.length > 0 ? (
                        <div className="divide-y divide-zinc-200">
                            {ponUtilization.map((pon) => {
                                const used = Number(pon.used ?? 0);
                                const capacity = Number(pon.capacity ?? 0);
                                const percentage = capacity > 0
                                    ? Math.round((used / capacity) * 100)
                                    : 0;

                                return (
                                    <div key={pon.port} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-zinc-950">
                                                    {pon.port}
                                                </p>
                                                <p className="mt-1 text-sm text-zinc-500">{pon.area}</p>
                                            </div>
                                            <StatusBadge
                                                tone={percentage >= 90 ? 'critical' : percentage >= 75 ? 'warning' : 'online'}
                                            >
                                                {percentage}% used
                                            </StatusBadge>
                                        </div>
                                        <ProgressBar
                                            className="mt-4"
                                            value={used}
                                            max={capacity}
                                            tone={utilizationTone(percentage)}
                                        />
                                        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                                            <span>{formatNumber(used)} ONU assigned</span>
                                            <span>{formatNumber(capacity)} capacity</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={ChartColumn}
                            title="No PON utilization data"
                            description="PON utilization will appear after ports and ONUs are registered."
                        />
                    )}
                </Card>

                <Card
                    title="Recently Offline ONU"
                    description="Devices that dropped from the network most recently."
                    icon={Router}
                    bodyClassName="p-0"
                >
                    {offlineOnus.length > 0 ? (
                        <div className="divide-y divide-zinc-200">
                            {offlineOnus.map((onu) => (
                                <div key={onu.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-zinc-950">
                                                {onu.id}
                                            </p>
                                            <p className="mt-1 truncate text-sm text-zinc-500">
                                                {onu.customer}
                                            </p>
                                        </div>
                                        <StatusBadge tone="offline">{onu.lastSeen}</StatusBadge>
                                    </div>
                                    <div className="mt-3 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2 xl:grid-cols-1">
                                        <span className="truncate">{onu.area}</span>
                                        <span className="truncate">{onu.port}</span>
                                        <span>RX {onu.rxPower}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-5">
                            <EmptyState
                                icon={WifiOff}
                                title="No recently offline ONUs"
                                description="Offline or LOS devices will appear here when they are detected."
                            />
                        </div>
                    )}
                </Card>
            </div>

            <Card
                className="mt-6"
                title="Recent Faults"
                description="Latest service-impacting events and operational status."
                icon={ShieldAlert}
                bodyClassName="p-0"
            >
                {recentFaults.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                        Ticket
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                        Severity
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                        Network Node
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                        Area
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                        Opened
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                {recentFaults.map((fault) => (
                                    <tr key={fault.ticket}>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-zinc-950">
                                            {fault.ticket}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <StatusBadge tone={statusTone(fault.severity)}>
                                                {fault.severity}
                                            </StatusBadge>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-700">
                                            {fault.node}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                                            {fault.area}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <StatusBadge tone={statusTone(fault.status)}>
                                                {fault.status}
                                            </StatusBadge>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                                            {fault.opened}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-5">
                        <EmptyState
                            icon={ShieldAlert}
                            title="No recent faults"
                            description="Service-impacting events will appear here when faults are reported."
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
