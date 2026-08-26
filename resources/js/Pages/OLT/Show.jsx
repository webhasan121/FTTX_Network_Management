import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Cable,
    Cpu,
    MapPin,
    Pencil,
    Server,
    Trash2,
} from 'lucide-react';

const statusTone = {
    online: 'online',
    offline: 'offline',
    maintenance: 'maintenance',
    active: 'online',
    disabled: 'offline',
};

function formatNumber(value) {
    return Number(value ?? 0).toLocaleString();
}

function detailValue(value, fallback = 'Not set') {
    return value === null || value === undefined || value === '' ? fallback : value;
}

function DetailItem({ label, value }) {
    return (
        <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">{label}</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-950">{detailValue(value)}</dd>
        </div>
    );
}

export default function Show({ olt }) {
    function deleteOlt() {
        const confirmed = window.confirm(
            `Delete ${olt.code}? This will also remove connected PON topology records linked to this OLT.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(route('olts.destroy', olt.id));
    }

    return (
        <AuthenticatedLayout
            title={olt.code}
            subtitle="Optical line terminal detail and connected PON inventory."
        >
            <Head title={olt.code} />

            <PageHeader
                eyebrow="Optical Line Terminals"
                title={olt.name}
                description={olt.description || 'Review OLT device identity, location, status, and downstream PON ports.'}
                meta={
                    <>
                        <StatusBadge tone={statusTone[olt.status] ?? 'neutral'}>
                            {olt.status_label}
                        </StatusBadge>
                        <StatusBadge tone="neutral">{olt.code}</StatusBadge>
                    </>
                }
                actions={
                    <>
                        <Button
                            variant="secondary"
                            icon={ArrowLeft}
                            onClick={() => router.visit(route('olts.index'))}
                        >
                            Back
                        </Button>
                        <Button
                            variant="secondary"
                            icon={Pencil}
                            onClick={() => router.visit(route('olts.edit', olt.id))}
                        >
                            Edit
                        </Button>
                        <Button variant="danger" icon={Trash2} onClick={deleteOlt}>
                            Delete
                        </Button>
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card
                    title="Device Information"
                    description="Inventory identity and management-plane details."
                    icon={Server}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem label="Name" value={olt.name} />
                        <DetailItem label="Code" value={olt.code} />
                        <DetailItem label="Vendor" value={olt.vendor} />
                        <DetailItem label="Model" value={olt.model} />
                        <DetailItem label="Management IP" value={olt.ip_address} />
                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">Status</dt>
                            <dd className="mt-2">
                                <StatusBadge tone={statusTone[olt.status] ?? 'neutral'}>
                                    {olt.status_label}
                                </StatusBadge>
                            </dd>
                        </div>
                    </dl>
                </Card>

                <Card
                    title="PON Capacity"
                    description="Provisioned and connected port counts."
                    icon={Cable}
                >
                    <div className="space-y-5">
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs font-semibold uppercase text-zinc-500">
                                Total PON Ports
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-zinc-950">
                                {formatNumber(olt.total_pon_ports)}
                            </p>
                        </div>
                        <div className="rounded-lg border border-zinc-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase text-zinc-500">
                                Connected PON Ports
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-zinc-950">
                                {formatNumber(olt.connected_pon_ports_count)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <Card
                    title="Location"
                    description="POP and geographic placement."
                    icon={MapPin}
                >
                    <dl className="space-y-5">
                        <DetailItem label="Location Name" value={olt.location_name} />
                        <DetailItem label="Latitude" value={olt.latitude} />
                        <DetailItem label="Longitude" value={olt.longitude} />
                        <DetailItem label="Created" value={olt.created_at} />
                        <DetailItem label="Last Updated" value={olt.updated_at} />
                    </dl>
                </Card>

                <Card
                    title="PON Port List"
                    description="Read-only list of PON ports currently connected to this OLT."
                    icon={Cpu}
                    bodyClassName="p-0"
                >
                    {olt.pon_ports.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Port
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Number
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Capacity
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 bg-white">
                                    {olt.pon_ports.map((ponPort) => (
                                        <tr key={ponPort.id}>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-zinc-950">
                                                {ponPort.name}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-700">
                                                {ponPort.port_number}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-700">
                                                {formatNumber(ponPort.capacity)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <StatusBadge tone={statusTone[ponPort.status] ?? 'neutral'}>
                                                    {ponPort.status}
                                                </StatusBadge>
                                            </td>
                                            <td className="min-w-72 px-5 py-4 text-sm text-zinc-500">
                                                {detailValue(ponPort.description, 'No description')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-5">
                            <EmptyState
                                icon={Cable}
                                title="No PON ports connected"
                                description="PON port records will appear here after they are added to this OLT."
                            />
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
