import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowDown,
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

function SignalCard({
    title,
    value,
}) {
    const hasValue =
        value !== null &&
        value !== undefined &&
        value !== '';

    const number = hasValue
        ? Number(value)
        : null;

    let tone =
        'border-zinc-200 bg-zinc-50 text-zinc-500';

    if (number !== null) {
        tone =
            'border-teal-100 bg-teal-50 text-teal-700';

        if (
            title === 'Rx Power' &&
            number <= -28
        ) {
            tone =
                'border-red-100 bg-red-50 text-red-700';
        } else if (
            title === 'Rx Power' &&
            number <= -25
        ) {
            tone =
                'border-amber-100 bg-amber-50 text-amber-700';
        }
    }

    return (
        <div
            className={`rounded-xl border p-4 ${tone}`}
        >
            <p className="text-xs font-semibold uppercase">
                {title}
            </p>

            <p className="mt-2 text-2xl font-semibold">
                {hasValue
                    ? `${Number(value).toFixed(
                          2,
                      )} dBm`
                    : '—'}
            </p>
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
        <div className="flex min-w-[150px] flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4">
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
    onu,
}) {
    const path = onu.network_path ?? {};

    function deleteOnu() {
        const confirmed =
            window.confirm(
                `Delete ONU ${onu.serial_number}? Devices assigned to customer connections cannot be deleted.`,
            );

        if (!confirmed) {
            return;
        }

        router.delete(
            route(
                'onu-ont.destroy',
                onu.id,
            ),
        );
    }

    return (
        <AuthenticatedLayout
            title={onu.serial_number}
            subtitle="ONU / ONT device, optical signal, and FTTX network path."
        >
            <Head
                title={onu.serial_number}
            />

            <PageHeader
                eyebrow="Customer Edge"
                title={onu.serial_number}
                description={
                    onu.description ||
                    'Review optical device status, network topology, signal information, and subscriber assignment.'
                }
                meta={
                    <>
                        <StatusBadge
                            tone={
                                statusTone[
                                    onu.status
                                ] ?? 'neutral'
                            }
                        >
                            {onu.status_label}
                        </StatusBadge>

                        {onu.vendor && (
                            <StatusBadge tone="neutral">
                                {onu.vendor}
                            </StatusBadge>
                        )}

                        {onu.model && (
                            <StatusBadge tone="info">
                                {onu.model}
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
                                        'onu-ont.index',
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
                                        'onu-ont.edit',
                                        onu.id,
                                    ),
                                )
                            }
                        >
                            Edit
                        </Button>

                        <Button
                            variant="danger"
                            icon={Trash2}
                            onClick={deleteOnu}
                        >
                            Delete
                        </Button>
                    </>
                }
            />

            {/* Main Info */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card
                    title="Device Information"
                    description="Physical ONU / ONT identity and operational information."
                    icon={Radio}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                            label="Serial Number"
                            value={
                                onu.serial_number
                            }
                        />

                        <DetailItem
                            label="MAC Address"
                            value={
                                onu.mac_address
                            }
                        />

                        <DetailItem
                            label="Vendor"
                            value={onu.vendor}
                        />

                        <DetailItem
                            label="Model"
                            value={onu.model}
                        />

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                Status
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={
                                        statusTone[
                                            onu
                                                .status
                                        ] ??
                                        'neutral'
                                    }
                                >
                                    {
                                        onu.status_label
                                    }
                                </StatusBadge>
                            </dd>
                        </div>

                        <DetailItem
                            label="Last Seen"
                            value={
                                onu.last_seen_at
                            }
                        />

                        <DetailItem
                            label="Installed At"
                            value={
                                onu.installed_at
                            }
                        />

                        <DetailItem
                            label="Created"
                            value={
                                onu.created_at
                            }
                        />

                        <DetailItem
                            label="Updated"
                            value={
                                onu.updated_at
                            }
                        />
                    </dl>
                </Card>

                <Card
                    title="Optical Signal"
                    description="Current mock optical telemetry."
                    icon={Wifi}
                >
                    <div className="grid gap-3">
                        <SignalCard
                            title="Rx Power"
                            value={onu.rx_power}
                        />

                        <SignalCard
                            title="Tx Power"
                            value={onu.tx_power}
                        />
                    </div>

                    <p className="mt-4 text-xs leading-5 text-zinc-500">
                        Signal values are demo
                        telemetry in this prototype.
                        Live values can later be
                        collected through OLT
                        integration.
                    </p>
                </Card>
            </div>

            {/* Network Path */}
            <Card
                className="mt-6"
                title="FTTX Network Path"
                description="Logical path from the OLT to this ONU / ONT."
                icon={Cable}
            >
                <div className="pb-2 overflow-x-auto">
                    <div className="flex min-w-[900px] items-center gap-3">
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
                                onu.serial_number
                            }
                            subtitle={
                                onu.status_label
                            }
                        />
                    </div>
                </div>
            </Card>

            {/* Customer + Assignment */}
            <div className="grid gap-6 mt-6 xl:grid-cols-2">
                <Card
                    title="Customer Connection"
                    description="Subscriber connection currently assigned to this ONU."
                    icon={User}
                >
                    {onu.connection ? (
                        <dl className="grid gap-5 sm:grid-cols-2">
                            <DetailItem
                                label="Connection Code"
                                value={
                                    onu.connection
                                        .connection_code
                                }
                            />

                            <DetailItem
                                label="Connection Status"
                                value={
                                    onu.connection
                                        .status
                                }
                            />

                            <DetailItem
                                label="Customer"
                                value={
                                    onu.connection
                                        .customer
                                        ?.name
                                }
                            />

                            <DetailItem
                                label="Customer Code"
                                value={
                                    onu.connection
                                        .customer
                                        ?.customer_code
                                }
                            />

                            <DetailItem
                                label="Phone"
                                value={
                                    onu.connection
                                        .customer
                                        ?.phone
                                }
                            />

                            <DetailItem
                                label="Area"
                                value={
                                    onu.connection
                                        .customer
                                        ?.area
                                }
                            />

                            <DetailItem
                                label="Activated At"
                                value={
                                    onu.connection
                                        .activated_at
                                }
                            />
                        </dl>
                    ) : (
                        <div className="p-6 text-center border border-dashed rounded-xl border-zinc-300 bg-zinc-50">
                            <User className="w-8 h-8 mx-auto text-zinc-300" />

                            <p className="mt-3 text-sm font-semibold text-zinc-700">
                                No customer assigned
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                                This ONU is currently
                                available for a future
                                customer connection.
                            </p>
                        </div>
                    )}
                </Card>

                <Card
                    title="Field Assignment"
                    description="Current downstream installation point."
                    icon={MapPin}
                >
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Distribution Point"
                            value={
                                path.distribution_point
                                    ?.name
                            }
                        />

                        <DetailItem
                            label="Distribution Code"
                            value={
                                path.distribution_point
                                    ?.code
                            }
                        />

                        <DetailItem
                            label="Splitter"
                            value={
                                path.splitter?.name
                            }
                        />

                        <DetailItem
                            label="Splitter Code"
                            value={
                                path.splitter?.code
                            }
                        />

                        <DetailItem
                            label="PON"
                            value={
                                path.pon_port?.name
                            }
                        />

                        <DetailItem
                            label="OLT"
                            value={
                                path.olt?.code
                            }
                        />
                    </dl>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
