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
    GitBranch,
    MapPin,
    Pencil,
    Server,
    Trash2,
} from 'lucide-react';

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
    splitter,
}) {
    const { can } = usePermission();

    const availablePorts = Math.max(
        Number(splitter.total_ports ?? 0) -
            Number(splitter.used_ports ?? 0),
        0,
    );

    const utilization =
        splitter.total_ports > 0
            ? Math.round(
                  (splitter.used_ports /
                      splitter.total_ports) *
                      100,
              )
            : 0;

    function deleteSplitter() {
        const confirmed = window.confirm(
            `Delete ${splitter.code}? Splitters with connected distribution points cannot be deleted.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'splitters.destroy',
                splitter.id,
            ),
        );
    }

    return (
        <AuthenticatedLayout
            title={splitter.name}
            subtitle="Splitter topology, utilization, and downstream distribution."
        >
            <Head title={splitter.name} />

            <PageHeader
                eyebrow="Passive Optical Network"
                title={splitter.name}
                description={
                    splitter.description ||
                    'Review splitter topology, capacity, upstream PON, and connected distribution points.'
                }
                meta={
                    <>
                        <StatusBadge tone="info">
                            {splitter.ratio}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {splitter.code}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {
                                splitter.pon_port
                                    ?.olt?.code
                            }{' '}
                            /{' '}
                            {
                                splitter.pon_port
                                    ?.name
                            }
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
                                        'splitters.index',
                                    ),
                                )
                            }
                        >
                            Back
                        </Button>

                        {can('splitter.update') && (
                            <Button
                                variant="secondary"
                                icon={Pencil}
                                onClick={() =>
                                    router.visit(
                                        route(
                                            'splitters.edit',
                                            splitter.id,
                                        ),
                                    )
                                }
                            >
                                Edit
                            </Button>
                        )}

                        {can('splitter.delete') && (
                            <Button
                                variant="danger"
                                icon={Trash2}
                                onClick={
                                    deleteSplitter
                                }
                            >
                                Delete
                            </Button>
                        )}
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card
                    title="Splitter Information"
                    description="Passive optical splitter identity and topology."
                    icon={GitBranch}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                            label="Name"
                            value={splitter.name}
                        />

                        <DetailItem
                            label="Code"
                            value={splitter.code}
                        />

                        <DetailItem
                            label="Ratio"
                            value={splitter.ratio}
                        />

                        <DetailItem
                            label="Total Ports"
                            value={
                                splitter.total_ports
                            }
                        />

                        <DetailItem
                            label="Used Ports"
                            value={
                                splitter.used_ports
                            }
                        />

                        <DetailItem
                            label="Available Ports"
                            value={
                                availablePorts
                            }
                        />
                    </dl>

                    <div className="pt-5 mt-6 border-t border-zinc-200">
                        <DetailItem
                            label="Description"
                            value={detailValue(
                                splitter.description,
                                'No description',
                            )}
                        />
                    </div>
                </Card>

                <Card
                    title="Port Utilization"
                    description="Current splitter output port usage."
                    icon={Cable}
                >
                    <div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Used Ports
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-zinc-950">
                                    {
                                        splitter.used_ports
                                    }
                                </p>
                            </div>

                            <p className="text-sm font-semibold text-teal-700">
                                {utilization}%
                            </p>
                        </div>

                        <ProgressBar
                            className="mt-4"
                            value={
                                splitter.used_ports
                            }
                            max={
                                splitter.total_ports
                            }
                            tone={
                                utilization >= 90
                                    ? 'danger'
                                    : utilization >=
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
                                        splitter.total_ports
                                    }
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg border-zinc-200 bg-zinc-50">
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Available
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-teal-700">
                                    {
                                        availablePorts
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 mt-6 xl:grid-cols-2">
                <Card
                    title="Upstream Network"
                    description="OLT and PON path feeding this splitter."
                    icon={Server}
                >
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="OLT Name"
                            value={
                                splitter.pon_port
                                    ?.olt?.name
                            }
                        />

                        <DetailItem
                            label="OLT Code"
                            value={
                                splitter.pon_port
                                    ?.olt?.code
                            }
                        />

                        <DetailItem
                            label="PON Name"
                            value={
                                splitter.pon_port
                                    ?.name
                            }
                        />

                        <DetailItem
                            label="PON Number"
                            value={
                                splitter.pon_port
                                    ?.port_number
                            }
                        />

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                PON Status
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={
                                        splitter
                                            .pon_port
                                            ?.status ===
                                        'active'
                                            ? 'online'
                                            : 'neutral'
                                    }
                                >
                                    {splitter
                                        .pon_port
                                        ?.status ||
                                        'Unknown'}
                                </StatusBadge>
                            </dd>
                        </div>
                    </dl>
                </Card>

                <Card
                    title="Field Location"
                    description="Physical splitter placement."
                    icon={MapPin}
                >
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Location"
                            value={
                                splitter.location_name
                            }
                        />

                        <div />

                        <DetailItem
                            label="Latitude"
                            value={
                                splitter.latitude
                            }
                        />

                        <DetailItem
                            label="Longitude"
                            value={
                                splitter.longitude
                            }
                        />
                    </dl>
                </Card>
            </div>

            <Card
                className="mt-6"
                title="Connected Distribution Points"
                description="Downstream FDB, FAT, NAP, and distribution nodes connected to this splitter."
                icon={Box}
                bodyClassName="p-0"
            >
                {splitter.distribution_points
                    ?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Distribution
                                        Point
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Type
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
                                {splitter.distribution_points.map(
                                    (point) => (
                                        <tr
                                            key={
                                                point.id
                                            }
                                        >
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-zinc-950">
                                                    {
                                                        point.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {
                                                        point.code
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <StatusBadge tone="info">
                                                    {
                                                        point.type
                                                    }
                                                </StatusBadge>
                                            </td>

                                            <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-700">
                                                {
                                                    point.used_ports
                                                }{' '}
                                                /{' '}
                                                {
                                                    point.total_ports
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-teal-700 whitespace-nowrap">
                                                {Math.max(
                                                    Number(
                                                        point.total_ports,
                                                    ) -
                                                        Number(
                                                            point.used_ports,
                                                        ),
                                                    0,
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-500">
                                                {point.location_name ||
                                                    'Unassigned'}
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
                            icon={Box}
                            title="No distribution points connected"
                            description="Distribution points will appear here after they are assigned to this splitter."
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
