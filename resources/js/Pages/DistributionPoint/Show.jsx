import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import ProgressBar from '@/Components/UI/ProgressBar';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import usePermission from '@/Hooks/usePermission';
import {
    ArrowLeft,
    Box,
    Cable,
    MapPin,
    Pencil,
    Router,
    Server,
    Trash2,
    Wifi,
} from 'lucide-react';

const onuTone = {
    online: 'online',
    offline: 'offline',
    los: 'danger',
    disabled: 'neutral',
};

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
    point,
}) {
    const { can } = usePermission();

    function deletePoint() {
        const confirmed = window.confirm(
            `Delete ${point.code}? Distribution points with connected ONUs cannot be deleted.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'distribution-points.destroy',
                point.id,
            ),
        );
    }

    return (
        <AuthenticatedLayout
            title={point.name}
            subtitle="Distribution node detail, utilization, and connected ONUs."
        >
            <Head title={point.name} />

            <PageHeader
                eyebrow="Field Network"
                title={point.name}
                description={
                    point.description ||
                    'Review distribution point topology, field location, capacity, and connected ONUs.'
                }
                meta={
                    <>
                        <StatusBadge tone="info">
                            {point.type_label}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {point.code}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {point.splitter?.code}
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
                                        'distribution-points.index',
                                    ),
                                )
                            }
                        >
                            Back
                        </Button>

                        {can('distribution-point.update') && (
                            <Button
                                variant="secondary"
                                icon={Pencil}
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
                        )}

                        {can('distribution-point.delete') && (
                            <Button
                                variant="danger"
                                icon={Trash2}
                                onClick={deletePoint}
                            >
                                Delete
                            </Button>
                        )}
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card
                    title="Distribution Point Information"
                    description="Field node identity and port configuration."
                    icon={Box}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                            label="Name"
                            value={point.name}
                        />

                        <DetailItem
                            label="Code"
                            value={point.code}
                        />

                        <DetailItem
                            label="Type"
                            value={point.type_label}
                        />

                        <DetailItem
                            label="Total Ports"
                            value={point.total_ports}
                        />

                        <DetailItem
                            label="Used Ports"
                            value={point.used_ports}
                        />

                        <DetailItem
                            label="Available Ports"
                            value={
                                point.available_ports
                            }
                        />
                    </dl>

                    <div className="pt-5 mt-6 border-t border-zinc-200">
                        <DetailItem
                            label="Description"
                            value={detailValue(
                                point.description,
                                'No description',
                            )}
                        />
                    </div>
                </Card>

                <Card
                    title="Port Utilization"
                    description="Current distribution port usage."
                    icon={Cable}
                >
                    <div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Used Ports
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-zinc-950">
                                    {point.used_ports}
                                </p>
                            </div>

                            <p className="text-sm font-semibold text-teal-700">
                                {
                                    point.utilization_percentage
                                }
                                %
                            </p>
                        </div>

                        <ProgressBar
                            className="mt-4"
                            value={
                                point.used_ports
                            }
                            max={
                                point.total_ports
                            }
                            tone={
                                point.utilization_percentage >=
                                90
                                    ? 'danger'
                                    : point.utilization_percentage >=
                                        75
                                      ? 'warning'
                                      : 'teal'
                            }
                        />

                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <div className="p-4 border rounded-lg border-zinc-200 bg-zinc-50">
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Total
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-zinc-950">
                                    {
                                        point.total_ports
                                    }
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg border-zinc-200 bg-zinc-50">
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Available
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-teal-700">
                                    {
                                        point.available_ports
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="p-4 mt-3 bg-white border rounded-lg border-zinc-200">
                            <p className="text-xs font-semibold uppercase text-zinc-500">
                                Connected ONUs
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-zinc-950">
                                {point.onus_count}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 mt-6 xl:grid-cols-2">
                <Card
                    title="Upstream Network Path"
                    description="Splitter, PON, and OLT feeding this distribution point."
                    icon={Server}
                >
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="OLT"
                            value={
                                point.splitter
                                    ?.pon_port
                                    ?.olt?.name
                            }
                        />

                        <DetailItem
                            label="OLT Code"
                            value={
                                point.splitter
                                    ?.pon_port
                                    ?.olt?.code
                            }
                        />

                        <DetailItem
                            label="PON Port"
                            value={
                                point.splitter
                                    ?.pon_port
                                    ?.name
                            }
                        />

                        <DetailItem
                            label="PON Number"
                            value={
                                point.splitter
                                    ?.pon_port
                                    ?.port_number
                            }
                        />

                        <DetailItem
                            label="Splitter"
                            value={
                                point.splitter
                                    ?.name
                            }
                        />

                        <DetailItem
                            label="Splitter Code"
                            value={
                                point.splitter
                                    ?.code
                            }
                        />

                        <DetailItem
                            label="Splitter Ratio"
                            value={
                                point.splitter
                                    ?.ratio
                            }
                        />
                    </dl>
                </Card>

                <Card
                    title="Field Location"
                    description="Physical placement and geographic coordinates."
                    icon={MapPin}
                >
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Location"
                            value={
                                point.location_name
                            }
                        />

                        <DetailItem
                            label="Address"
                            value={point.address}
                        />

                        <DetailItem
                            label="Latitude"
                            value={
                                point.latitude
                            }
                        />

                        <DetailItem
                            label="Longitude"
                            value={
                                point.longitude
                            }
                        />
                    </dl>
                </Card>
            </div>

            <Card
                className="mt-6"
                title="Connected ONU / ONT"
                description="Customer-edge optical devices connected through this distribution point."
                icon={Router}
                bodyClassName="p-0"
            >
                {point.onus?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-[900px] w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        ONU / ONT
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Vendor
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Signal
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Last Seen
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-zinc-200">
                                {point.onus.map(
                                    (onu) => (
                                        <tr key={onu.id}>
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-zinc-950">
                                                    {
                                                        onu.serial_number
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {onu.mac_address ||
                                                        'No MAC'}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-zinc-700">
                                                    {onu.vendor ||
                                                        '-'}
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {onu.model ||
                                                        '-'}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Wifi className="w-4 h-4 text-teal-600" />

                                                    <span className="text-sm font-semibold text-zinc-700">
                                                        {onu.rx_power ??
                                                            '-'}{' '}
                                                        dBm
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-zinc-500">
                                                    Tx:{' '}
                                                    {onu.tx_power ??
                                                        '-'}{' '}
                                                    dBm
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <StatusBadge
                                                    tone={
                                                        onuTone[
                                                            onu
                                                                .status
                                                        ] ??
                                                        'neutral'
                                                    }
                                                >
                                                    {
                                                        onu.status
                                                    }
                                                </StatusBadge>
                                            </td>

                                            <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-500">
                                                {onu.last_seen_at ||
                                                    'Never'}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={Router}
                            title="No ONUs connected"
                            description="ONU / ONT devices will appear here after they are assigned to this distribution point."
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
