import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Box,
    Cable,
    GitBranch,
    MapPin,
    Pencil,
    Radio,
    Server,
    Trash2,
    User,
    Wifi,
} from 'lucide-react';

const statusTone = {
    active: 'online',
    inactive: 'neutral',
    disconnected: 'offline',
};

const onuTone = {
    online: 'online',
    offline: 'offline',
    los: 'critical',
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

function NetworkNode({
    icon: Icon,
    label,
    title,
    subtitle,
}) {
    return (
        <div className="flex min-w-[155px] flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-zinc-100 text-zinc-700">
                <Icon className="w-5 h-5" />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                    {label}
                </p>

                <p className="mt-1 text-sm font-semibold truncate text-zinc-950">
                    {title || 'Unassigned'}
                </p>

                {subtitle && (
                    <p className="mt-1 text-xs truncate text-zinc-500">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function Show({
    connection,
}) {
    const path =
        connection.network_path ?? {};

    const customer =
        connection.customer;

    const onu =
        connection.onu;

    function deleteConnection() {
        const confirmed = window.confirm(
            `Delete ${connection.connection_code}? Active connections must be disconnected first.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'connections.destroy',
                connection.id,
            ),
        );
    }

    return (
        <AuthenticatedLayout
            title={
                connection.connection_code
            }
            subtitle="Customer service assignment and complete FTTX network path."
        >
            <Head
                title={
                    connection.connection_code
                }
            />

            <PageHeader
                eyebrow="Service Provisioning"
                title={
                    connection.connection_code
                }
                description={
                    connection.notes ||
                    'Review subscriber assignment, ONU / ONT device, status, and complete network topology.'
                }
                meta={
                    <>
                        <StatusBadge
                            tone={
                                statusTone[
                                    connection.status
                                ] ?? 'neutral'
                            }
                        >
                            {
                                connection.status_label
                            }
                        </StatusBadge>

                        {onu && (
                            <StatusBadge
                                tone={
                                    onuTone[
                                        onu.status
                                    ] ?? 'neutral'
                                }
                            >
                                ONU {onu.status}
                            </StatusBadge>
                        )}
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
                                        'connections.index',
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
                                        'connections.edit',
                                        connection.id,
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
                                deleteConnection
                            }
                        >
                            Delete
                        </Button>
                    </>
                }
            />

            {/* Connection Info */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card
                    title="Connection Information"
                    description="Service assignment and lifecycle information."
                    icon={Cable}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                            label="Connection Code"
                            value={
                                connection.connection_code
                            }
                        />

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                Status
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={
                                        statusTone[
                                            connection
                                                .status
                                        ] ??
                                        'neutral'
                                    }
                                >
                                    {
                                        connection.status_label
                                    }
                                </StatusBadge>
                            </dd>
                        </div>

                        <DetailItem
                            label="Activated At"
                            value={
                                connection.activated_at_formatted
                            }
                        />

                        <DetailItem
                            label="Disconnected At"
                            value={
                                connection.disconnected_at_formatted
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={
                                connection.created_at_formatted
                            }
                        />

                        <DetailItem
                            label="Updated At"
                            value={
                                connection.updated_at_formatted
                            }
                        />
                    </dl>

                    <div className="pt-5 mt-6 border-t border-zinc-200">
                        <DetailItem
                            label="Notes"
                            value={
                                connection.notes ||
                                'No notes'
                            }
                        />
                    </div>
                </Card>

                {/* Optical */}
                <Card
                    title="ONU Status"
                    description="Current assigned customer-edge device."
                    icon={Wifi}
                >
                    {onu ? (
                        <>
                            <p className="text-xs font-semibold uppercase text-zinc-500">
                                Serial Number
                            </p>

                            <p className="mt-2 text-lg font-semibold text-zinc-950">
                                {
                                    onu.serial_number
                                }
                            </p>

                            <div className="mt-3">
                                <StatusBadge
                                    tone={
                                        onuTone[
                                            onu.status
                                        ] ??
                                        'neutral'
                                    }
                                >
                                    {onu.status}
                                </StatusBadge>
                            </div>

                            <div className="p-4 mt-5 border border-teal-100 rounded-xl bg-teal-50">
                                <p className="text-xs font-semibold text-teal-700 uppercase">
                                    Rx Power
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-teal-800">
                                    {onu.rx_power !==
                                        null &&
                                    onu.rx_power !==
                                        undefined
                                        ? `${onu.rx_power} dBm`
                                        : '—'}
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                className="mt-4"
                                onClick={() =>
                                    router.visit(
                                        route(
                                            'onu-ont.show',
                                            onu.id,
                                        ),
                                    )
                                }
                            >
                                View ONU
                            </Button>
                        </>
                    ) : (
                        <p className="text-sm text-zinc-500">
                            No ONU assigned.
                        </p>
                    )}
                </Card>
            </div>

            {/* Customer */}
            <div className="grid gap-6 mt-6 xl:grid-cols-2">
                <Card
                    title="Customer"
                    description="Subscriber receiving this FTTX connection."
                    icon={User}
                >
                    {customer ? (
                        <>
                            <dl className="grid gap-5 sm:grid-cols-2">
                                <DetailItem
                                    label="Customer Name"
                                    value={
                                        customer.name
                                    }
                                />

                                <DetailItem
                                    label="Customer Code"
                                    value={
                                        customer.customer_code
                                    }
                                />

                                <DetailItem
                                    label="Phone"
                                    value={
                                        customer.phone
                                    }
                                />

                                <DetailItem
                                    label="Email"
                                    value={
                                        customer.email
                                    }
                                />

                                <DetailItem
                                    label="Area"
                                    value={
                                        customer.area
                                    }
                                />

                                <DetailItem
                                    label="Status"
                                    value={
                                        customer.status
                                    }
                                />
                            </dl>

                            <Button
                                variant="secondary"
                                className="mt-5"
                                onClick={() =>
                                    router.visit(
                                        route(
                                            'customers.show',
                                            customer.id,
                                        ),
                                    )
                                }
                            >
                                View Customer
                            </Button>
                        </>
                    ) : (
                        <p className="text-sm text-zinc-500">
                            Customer record unavailable.
                        </p>
                    )}
                </Card>

                <Card
                    title="Installation Location"
                    description="Customer service installation area."
                    icon={MapPin}
                >
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Area"
                            value={
                                customer?.area
                            }
                        />

                        <DetailItem
                            label="Address"
                            value={
                                customer?.address
                            }
                        />

                        <DetailItem
                            label="Latitude"
                            value={
                                customer?.latitude
                            }
                        />

                        <DetailItem
                            label="Longitude"
                            value={
                                customer?.longitude
                            }
                        />
                    </dl>
                </Card>
            </div>

            {/* Full Network Path */}
            <Card
                className="mt-6"
                title="Complete FTTX Network Path"
                description="End-to-end topology from the central OLT to the subscriber."
                icon={Cable}
            >
                <div className="pb-2 overflow-x-auto">
                    <div className="flex min-w-[1100px] items-center gap-3">
                        <NetworkNode
                            icon={Server}
                            label="OLT"
                            title={
                                path.olt?.code
                            }
                            subtitle={
                                path.olt?.name
                            }
                        />

                        <ArrowRight className="w-5 h-5 shrink-0 text-zinc-300" />

                        <NetworkNode
                            icon={Cable}
                            label="PON Port"
                            title={
                                path.pon_port
                                    ?.name
                            }
                            subtitle={
                                path.pon_port
                                    ? `Port #${path.pon_port.port_number}`
                                    : null
                            }
                        />

                        <ArrowRight className="w-5 h-5 shrink-0 text-zinc-300" />

                        <NetworkNode
                            icon={GitBranch}
                            label="Splitter"
                            title={
                                path.splitter
                                    ?.code
                            }
                            subtitle={
                                path.splitter
                                    ?.ratio
                            }
                        />

                        <ArrowRight className="w-5 h-5 shrink-0 text-zinc-300" />

                        <NetworkNode
                            icon={Box}
                            label="Distribution"
                            title={
                                path.distribution_point
                                    ?.code
                            }
                            subtitle={
                                path.distribution_point
                                    ?.name
                            }
                        />

                        <ArrowRight className="w-5 h-5 shrink-0 text-zinc-300" />

                        <NetworkNode
                            icon={Radio}
                            label="ONU / ONT"
                            title={
                                path.onu
                                    ?.serial_number
                            }
                            subtitle={
                                path.onu?.status
                            }
                        />

                        <ArrowRight className="w-5 h-5 shrink-0 text-zinc-300" />

                        <NetworkNode
                            icon={User}
                            label="Customer"
                            title={
                                customer?.name
                            }
                            subtitle={
                                customer?.customer_code
                            }
                        />
                    </div>
                </div>

                <div className="px-4 py-3 mt-5 border border-teal-100 rounded-xl bg-teal-50">
                    <p className="text-sm font-medium text-teal-800">
                        OLT → PON Port →
                        Splitter → Distribution
                        Point → ONU / ONT →
                        Customer
                    </p>
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
