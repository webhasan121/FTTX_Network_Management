import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import StatusBadge from '@/Components/UI/StatusBadge';
import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Cable,
    Radio,
    Save,
    User,
} from 'lucide-react';

const inputClassName =
    'block h-10 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const textareaClassName =
    'block min-h-28 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const onuTone = {
    online: 'online',
    offline: 'offline',
    los: 'critical',
    disabled: 'neutral',
};

function Field({
    label,
    name,
    error,
    children,
    hint,
    className = '',
}) {
    return (
        <div className={className}>
            <label
                htmlFor={`connection-${name}`}
                className="text-sm font-medium text-zinc-700"
            >
                {label}
            </label>

            <div className="mt-2">
                {children}
            </div>

            {hint && !error && (
                <p className="mt-2 text-xs text-zinc-500">
                    {hint}
                </p>
            )}

            <InputError
                message={error}
                className="mt-2"
            />
        </div>
    );
}

export default function ConnectionForm({
    connection,
    customers,
    onus,
    statuses,
    submitLabel,
}) {
    const isEditing = Boolean(
        connection?.id,
    );

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        customer_id:
            connection?.customer_id ?? '',

        onu_id:
            connection?.onu_id ?? '',

        connection_code:
            connection?.connection_code ?? '',

        status:
            connection?.status ?? 'active',

        activated_at:
            connection?.activated_at ?? '',

        disconnected_at:
            connection?.disconnected_at ?? '',

        notes:
            connection?.notes ?? '',
    });

    const selectedCustomer =
        customers.find(
            (customer) =>
                String(customer.id) ===
                String(data.customer_id),
        );

    const selectedOnu =
        onus.find(
            (onu) =>
                String(onu.id) ===
                String(data.onu_id),
        );

    const point =
        selectedOnu?.distribution_point;

    const splitter =
        point?.splitter;

    const pon =
        splitter?.pon_port;

    const olt =
        pon?.olt;

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(
                route(
                    'connections.update',
                    connection.id,
                ),
            );

            return;
        }

        post(
            route(
                'connections.store',
            ),
        );
    }

    function cancel() {
        router.visit(
            isEditing
                ? route(
                      'connections.show',
                      connection.id,
                  )
                : route(
                      'connections.index',
                  ),
        );
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="Connection Information"
                description="Assign a customer to an available ONU / ONT and maintain the service lifecycle."
                icon={Cable}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Customer"
                        name="customer_id"
                        error={
                            errors.customer_id
                        }
                        hint={
                            selectedCustomer
                                ? `${selectedCustomer.customer_code} • ${selectedCustomer.phone || 'No phone'}`
                                : 'Select the subscriber receiving this connection.'
                        }
                    >
                        <select
                            id="connection-customer_id"
                            value={
                                data.customer_id
                            }
                            onChange={(event) =>
                                setData(
                                    'customer_id',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            <option value="">
                                Select Customer
                            </option>

                            {customers.map(
                                (customer) => (
                                    <option
                                        key={
                                            customer.id
                                        }
                                        value={
                                            customer.id
                                        }
                                    >
                                        {
                                            customer.customer_code
                                        }{' '}
                                        -{' '}
                                        {
                                            customer.name
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="ONU / ONT"
                        name="onu_id"
                        error={errors.onu_id}
                        hint="Only available ONU / ONT devices are shown."
                    >
                        <select
                            id="connection-onu_id"
                            value={
                                data.onu_id
                            }
                            onChange={(event) =>
                                setData(
                                    'onu_id',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            <option value="">
                                Select ONU / ONT
                            </option>

                            {onus.map((onu) => (
                                <option
                                    key={onu.id}
                                    value={onu.id}
                                >
                                    {onu.serial_number}
                                    {' - '}
                                    {onu.status}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        label="Connection Code"
                        name="connection_code"
                        error={
                            errors.connection_code
                        }
                        hint="Unique service connection reference."
                    >
                        <input
                            id="connection-connection_code"
                            type="text"
                            value={
                                data.connection_code
                            }
                            onChange={(event) =>
                                setData(
                                    'connection_code',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="CON-00125"
                        />
                    </Field>

                    <Field
                        label="Connection Status"
                        name="status"
                        error={errors.status}
                    >
                        <select
                            id="connection-status"
                            value={data.status}
                            onChange={(event) =>
                                setData(
                                    'status',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            {statuses.map(
                                (status) => (
                                    <option
                                        key={
                                            status.value
                                        }
                                        value={
                                            status.value
                                        }
                                    >
                                        {
                                            status.label
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Activated At"
                        name="activated_at"
                        error={
                            errors.activated_at
                        }
                        hint="Leave empty and the system will set the time automatically when active."
                    >
                        <input
                            id="connection-activated_at"
                            type="datetime-local"
                            value={
                                data.activated_at
                            }
                            onChange={(event) =>
                                setData(
                                    'activated_at',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        />
                    </Field>

                    <Field
                        label="Disconnected At"
                        name="disconnected_at"
                        error={
                            errors.disconnected_at
                        }
                        hint={
                            data.status ===
                            'disconnected'
                                ? 'Leave empty to automatically use the current time.'
                                : 'Used when connection status becomes disconnected.'
                        }
                    >
                        <input
                            id="connection-disconnected_at"
                            type="datetime-local"
                            value={
                                data.disconnected_at
                            }
                            onChange={(event) =>
                                setData(
                                    'disconnected_at',
                                    event.target
                                        .value,
                                )
                            }
                            disabled={
                                data.status !==
                                'disconnected'
                            }
                            className={`${inputClassName} ${
                                data.status !==
                                'disconnected'
                                    ? 'cursor-not-allowed bg-zinc-100'
                                    : ''
                            }`}
                        />
                    </Field>

                    <Field
                        label="Notes"
                        name="notes"
                        error={errors.notes}
                        className="md:col-span-2"
                    >
                        <textarea
                            id="connection-notes"
                            value={data.notes}
                            onChange={(event) =>
                                setData(
                                    'notes',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                textareaClassName
                            }
                            placeholder="Installation notes, service remarks, customer instructions, or technician notes."
                        />
                    </Field>
                </div>
            </Card>

            {/* Selected Customer + ONU Preview */}
            {(selectedCustomer ||
                selectedOnu) && (
                <div className="grid gap-6 mt-6 xl:grid-cols-2">
                    <Card
                        title="Selected Customer"
                        description="Subscriber assigned to this service."
                        icon={User}
                    >
                        {selectedCustomer ? (
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs font-semibold uppercase text-zinc-500">
                                        Customer
                                    </dt>

                                    <dd className="mt-1 text-sm font-semibold text-zinc-900">
                                        {
                                            selectedCustomer.name
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs font-semibold uppercase text-zinc-500">
                                        Code
                                    </dt>

                                    <dd className="mt-1 text-sm font-semibold text-zinc-900">
                                        {
                                            selectedCustomer.customer_code
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs font-semibold uppercase text-zinc-500">
                                        Phone
                                    </dt>

                                    <dd className="mt-1 text-sm text-zinc-700">
                                        {selectedCustomer.phone ||
                                            'Not set'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs font-semibold uppercase text-zinc-500">
                                        Area
                                    </dt>

                                    <dd className="mt-1 text-sm text-zinc-700">
                                        {selectedCustomer.area ||
                                            'Not set'}
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No customer selected.
                            </p>
                        )}
                    </Card>

                    <Card
                        title="Selected ONU / ONT"
                        description="Device and upstream FTTX path."
                        icon={Radio}
                    >
                        {selectedOnu ? (
                            <>
                                <div className="flex flex-wrap items-center gap-3">
                                    <p className="text-sm font-semibold text-zinc-950">
                                        {
                                            selectedOnu.serial_number
                                        }
                                    </p>

                                    <StatusBadge
                                        tone={
                                            onuTone[
                                                selectedOnu.status
                                            ] ??
                                            'neutral'
                                        }
                                    >
                                        {
                                            selectedOnu.status
                                        }
                                    </StatusBadge>
                                </div>

                                <div className="p-4 mt-4 border rounded-xl border-zinc-200 bg-zinc-50">
                                    <p className="text-xs font-semibold uppercase text-zinc-500">
                                        Network Path
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                                        {olt?.code ||
                                            'No OLT'}
                                        {' → '}
                                        {pon?.name ||
                                            'No PON'}
                                        {' → '}
                                        {splitter?.code ||
                                            'No Splitter'}
                                        {' → '}
                                        {point?.code ||
                                            'No Distribution Point'}
                                    </p>
                                </div>

                                <p className="mt-3 text-xs text-zinc-500">
                                    Rx Power:{' '}
                                    {selectedOnu.rx_power ??
                                        'N/A'}{' '}
                                    dBm
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No ONU selected.
                            </p>
                        )}
                    </Card>
                </div>
            )}

            <div className="flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    icon={ArrowLeft}
                    onClick={cancel}
                    disabled={processing}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    disabled={processing}
                >
                    {processing
                        ? 'Saving...'
                        : submitLabel}
                </Button>
            </div>
        </form>
    );
}
