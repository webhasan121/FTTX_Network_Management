import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import ProgressBar from '@/Components/UI/ProgressBar';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Cable,
    GitBranch,
    Pencil,
    Server,
    Trash2,
    Users,
} from 'lucide-react';

const statusTone = {
    active: 'online',
    disabled: 'offline',
    online: 'online',
    offline: 'offline',
    maintenance: 'maintenance',
};

function formatNumber(value) {
    return Number(value ?? 0).toLocaleString();
}

function detailValue(
    value,
    fallback = 'Not set',
) {
    return value === null ||
        value === undefined ||
        value === ''
        ? fallback
        : value;
}

function DetailItem({
    label,
    value,
}) {
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

export default function Show({
    port,
}) {
    function deletePort() {
        const confirmed =
            window.confirm(
                `Delete ${port.name}? PON ports with connected splitters cannot be deleted.`,
            );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'pon-ports.destroy',
                port.id,
            ),
        );
    }

    return (
        <AuthenticatedLayout
            title={port.name}
            subtitle="PON port detail, utilization, and downstream splitter inventory."
        >
            <Head title={port.name} />

            <PageHeader
                eyebrow="Access Layer"
                title={port.name}
                description={
                    port.description ||
                    'Review PON interface information, parent OLT, capacity utilization, and connected splitters.'
                }
                meta={
                    <>
                        <StatusBadge
                            tone={
                                statusTone[
                                    port.status
                                ] ?? 'neutral'
                            }
                        >
                            {port.status_label}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {port.olt.code}
                        </StatusBadge>

                        <StatusBadge tone="info">
                            Port #{port.port_number}
                        </StatusBadge>
                    </>
                }
                actions={
                    <>
                        <Button
                            variant="secondary"
                            icon={ArrowLeft}
                            onClick={() =>
                                router.visit(
                                    route(
                                        'pon-ports.index',
                                    ),
                                )
                            }
                        >
                            Back
                        </Button>

                        <Button
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

                        <Button
                            variant="danger"
                            icon={Trash2}
                            onClick={
                                deletePort
                            }
                        >
                            Delete
                        </Button>
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card
                    title="PON Port Information"
                    description="Parent OLT and interface configuration."
                    icon={Cable}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                            label="Port Name"
                            value={port.name}
                        />

                        <DetailItem
                            label="Port Number"
                            value={`#${port.port_number}`}
                        />

                        <DetailItem
                            label="Capacity"
                            value={`${formatNumber(
                                port.capacity,
                            )} subscribers`}
                        />

                        <DetailItem
                            label="OLT Name"
                            value={port.olt.name}
                        />

                        <DetailItem
                            label="OLT Code"
                            value={port.olt.code}
                        />

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                Status
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={
                                        statusTone[
                                            port.status
                                        ] ??
                                        'neutral'
                                    }
                                >
                                    {
                                        port.status_label
                                    }
                                </StatusBadge>
                            </dd>
                        </div>
                    </dl>

                    <div className="pt-5 mt-6 border-t border-zinc-200">
                        <DetailItem
                            label="Description"
                            value={detailValue(
                                port.description,
                                'No description',
                            )}
                        />
                    </div>
                </Card>

                <Card
                    title="Capacity Summary"
                    description="Current logical ONU utilization."
                    icon={Users}
                >
                    <div className="space-y-5">
                        <div>
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-zinc-500">
                                        Connected ONUs
                                    </p>

                                    <p className="mt-2 text-3xl font-semibold text-zinc-950">
                                        {formatNumber(
                                            port.connected_onus_count,
                                        )}
                                    </p>
                                </div>

                                <p className="text-sm font-semibold text-teal-700">
                                    {
                                        port.utilization_percentage
                                    }
                                    %
                                </p>
                            </div>

                            <ProgressBar
                                className="mt-4"
                                value={
                                    port.connected_onus_count
                                }
                                max={
                                    port.capacity
                                }
                                tone="teal"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 border rounded-lg border-zinc-200 bg-zinc-50">
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Capacity
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-zinc-950">
                                    {formatNumber(
                                        port.capacity,
                                    )}
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg border-zinc-200 bg-zinc-50">
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Available
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-teal-700">
                                    {formatNumber(
                                        port.available_capacity,
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-white border rounded-lg border-zinc-200">
                            <p className="text-xs font-semibold uppercase text-zinc-500">
                                Connected Splitters
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-zinc-950">
                                {formatNumber(
                                    port.splitters_count,
                                )}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <Card
                    title="Parent OLT"
                    description="Upstream access device."
                    icon={Server}
                >
                    <dl className="space-y-5">
                        <DetailItem
                            label="OLT"
                            value={port.olt.name}
                        />

                        <DetailItem
                            label="Code"
                            value={port.olt.code}
                        />

                        <DetailItem
                            label="Vendor"
                            value={port.olt.vendor}
                        />

                        <DetailItem
                            label="Model"
                            value={port.olt.model}
                        />

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                OLT Status
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={
                                        statusTone[
                                            port.olt
                                                .status
                                        ] ??
                                        'neutral'
                                    }
                                >
                                    {
                                        port.olt
                                            .status
                                    }
                                </StatusBadge>
                            </dd>
                        </div>

                        <DetailItem
                            label="Created"
                            value={
                                port.created_at
                            }
                        />

                        <DetailItem
                            label="Last Updated"
                            value={
                                port.updated_at
                            }
                        />
                    </dl>
                </Card>

                <Card
                    title="Connected Splitters"
                    description="Passive splitter inventory currently assigned to this PON port."
                    icon={GitBranch}
                    bodyClassName="p-0"
                >
                    {port.splitters.length >
                    0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Splitter
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Ratio
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Ports
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Available
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                            Location
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {port.splitters.map(
                                        (
                                            splitter,
                                        ) => (
                                            <tr
                                                key={
                                                    splitter.id
                                                }
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-zinc-950">
                                                        {
                                                            splitter.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-zinc-500">
                                                        {
                                                            splitter.code
                                                        }
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-sm font-medium whitespace-nowrap text-zinc-700">
                                                    {
                                                        splitter.ratio
                                                    }
                                                </td>

                                                <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-700">
                                                    {formatNumber(
                                                        splitter.used_ports,
                                                    )}
                                                    {' / '}
                                                    {formatNumber(
                                                        splitter.total_ports,
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-semibold text-teal-700 whitespace-nowrap">
                                                    {formatNumber(
                                                        Math.max(
                                                            splitter.total_ports -
                                                                splitter.used_ports,
                                                            0,
                                                        ),
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-500">
                                                    {detailValue(
                                                        splitter.location_name,
                                                        'Unassigned',
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-5">
                            <EmptyState
                                icon={GitBranch}
                                title="No splitters connected"
                                description="Splitter records will appear here after they are assigned to this PON port."
                            />
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
