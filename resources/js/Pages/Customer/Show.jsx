import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import EmptyState from "@/Components/UI/EmptyState";
import PageHeader from "@/Components/UI/PageHeader";
import StatusBadge from "@/Components/UI/StatusBadge";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import usePermission from "@/Hooks/usePermission";

import {
    ArrowLeft,
    Cable,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Radio,
    Trash2,
    User,
} from "lucide-react";

const customerTone = {
    active: "online",
    inactive: "neutral",
};

const connectionTone = {
    active: "online",
    inactive: "neutral",
    disconnected: "offline",
};

const onuTone = {
    online: "online",
    offline: "offline",
    los: "danger",
    disabled: "neutral",
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

function formatDate(value) {
    if (!value) {
        return "Not set";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

export default function Show({ customer }) {
    const { can } = usePermission();

    function deleteCustomer() {
        const confirmed = window.confirm(
            `Delete ${customer.name}? Customers with connection records cannot be deleted.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(route("customers.destroy", customer.id));
    }

    return (
        <AuthenticatedLayout
            title={customer.name}
            subtitle="Subscriber information and network connection history."
        >
            <Head title={customer.name} />

            <PageHeader
                eyebrow="Subscriber Management"
                title={customer.name}
                description="Review subscriber contact information, installation location, and associated FTTX connections."
                meta={
                    <>
                        <StatusBadge
                            tone={customerTone[customer.status] ?? "neutral"}
                        >
                            {customer.status_label}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {customer.customer_code}
                        </StatusBadge>
                    </>
                }
                actions={
                    <>
                        <Button
                            variant="secondary"
                            icon={ArrowLeft}
                            onClick={() =>
                                router.visit(route("customers.index"))
                            }
                        >
                            Back
                        </Button>

                        {can("customer.update") && (
                            <Button
                                variant="secondary"
                                icon={Pencil}
                                onClick={() =>
                                    router.visit(
                                        route("customers.edit", customer.id),
                                    )
                                }
                            >
                                Edit
                            </Button>
                        )}

                        {can("customer.delete") && (
                            <Button
                                variant="danger"
                                icon={Trash2}
                                onClick={deleteCustomer}
                            >
                                Delete
                            </Button>
                        )}
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                {/* Basic Info */}
                <Card
                    title="Customer Information"
                    description="Subscriber identity and account information."
                    icon={User}
                >
                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                            label="Customer Name"
                            value={customer.name}
                        />

                        <DetailItem
                            label="Customer Code"
                            value={customer.customer_code}
                        />

                        <div>
                            <dt className="text-xs font-semibold uppercase text-zinc-500">
                                Status
                            </dt>

                            <dd className="mt-2">
                                <StatusBadge
                                    tone={
                                        customerTone[customer.status] ??
                                        "neutral"
                                    }
                                >
                                    {customer.status_label}
                                </StatusBadge>
                            </dd>
                        </div>

                        <DetailItem
                            label="Created"
                            value={customer.created_at}
                        />

                        <DetailItem
                            label="Last Updated"
                            value={customer.updated_at}
                        />
                    </dl>
                </Card>

                {/* Contact */}
                <Card
                    title="Contact"
                    description="Customer communication details."
                    icon={Phone}
                >
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 border rounded-xl border-zinc-200">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />

                            <div>
                                <p className="text-xs font-semibold uppercase text-zinc-400">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm font-semibold text-zinc-800">
                                    {customer.phone || "Not set"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 border rounded-xl border-zinc-200">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />

                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase text-zinc-400">
                                    Email
                                </p>

                                <p className="mt-1 text-sm font-semibold break-all text-zinc-800">
                                    {customer.email || "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Location */}
            <Card
                className="mt-6"
                title="Installation Location"
                description="Subscriber service address and geographic coordinates."
                icon={MapPin}
            >
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem label="Area" value={customer.area} />

                    <DetailItem label="Address" value={customer.address} />

                    <DetailItem label="Latitude" value={customer.latitude} />

                    <DetailItem label="Longitude" value={customer.longitude} />
                </dl>
            </Card>

            {/* Connections */}
            <Card
                className="mt-6"
                title="FTTX Connections"
                description="Current and historical network connections for this subscriber."
                icon={Cable}
                bodyClassName="p-0"
            >
                {customer.connections?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px] divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Connection
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        ONU / ONT
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Network Path
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Signal
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-left uppercase text-zinc-500">
                                        Activated
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-zinc-200">
                                {customer.connections.map((connection) => {
                                    const onu = connection.onu;

                                    const point = onu?.distribution_point;

                                    const splitter = point?.splitter;

                                    const pon = splitter?.pon_port;

                                    const olt = pon?.olt;

                                    return (
                                        <tr
                                            key={connection.id}
                                            className="hover:bg-zinc-50/70"
                                        >
                                            <td className="min-w-[170px] px-5 py-4">
                                                <p className="text-sm font-semibold text-zinc-950">
                                                    {connection.connection_code}
                                                </p>

                                                {connection.disconnected_at && (
                                                    <p className="mt-1 text-xs text-zinc-500">
                                                        Disconnected:{" "}
                                                        {formatDate(
                                                            connection.disconnected_at,
                                                        )}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="min-w-[210px] px-5 py-4">
                                                {onu ? (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <Radio className="w-4 h-4 text-zinc-400" />

                                                            <p className="text-sm font-semibold text-zinc-800">
                                                                {
                                                                    onu.serial_number
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="mt-2">
                                                            <StatusBadge
                                                                tone={
                                                                    onuTone[
                                                                        onu
                                                                            .status
                                                                    ] ??
                                                                    "neutral"
                                                                }
                                                            >
                                                                {onu.status}
                                                            </StatusBadge>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-zinc-400">
                                                        No ONU
                                                    </span>
                                                )}
                                            </td>

                                            <td className="min-w-[240px] px-5 py-4">
                                                <p className="text-sm font-semibold text-zinc-800">
                                                    {olt?.code || "-"}
                                                    {" / "}
                                                    {pon?.name || "-"}
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {splitter?.code || "-"}
                                                    {" → "}
                                                    {point?.code || "-"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                {onu?.rx_power !== null &&
                                                onu?.rx_power !== undefined ? (
                                                    <span className="text-sm font-semibold text-teal-700">
                                                        {onu.rx_power} dBm
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-zinc-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <StatusBadge
                                                    tone={
                                                        connectionTone[
                                                            connection.status
                                                        ] ?? "neutral"
                                                    }
                                                >
                                                    {connection.status}
                                                </StatusBadge>
                                            </td>

                                            <td className="px-5 py-4 text-sm whitespace-nowrap text-zinc-500">
                                                {formatDate(
                                                    connection.activated_at,
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6">
                        <EmptyState
                            icon={Cable}
                            title="No connections yet"
                            description="This customer does not have an FTTX connection assigned yet."
                        />
                    </div>
                )}
            </Card>
        </AuthenticatedLayout>
    );
}
