import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Radio,
    Save,
} from 'lucide-react';

const inputClassName =
    'block h-10 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const textareaClassName =
    'block min-h-28 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

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
                htmlFor={`onu-${name}`}
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

export default function OnuForm({
    onu,
    statuses,
    distributionPoints,
    submitLabel,
}) {
    const isEditing = Boolean(onu?.id);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        distribution_point_id:
            onu?.distribution_point_id ?? '',

        serial_number:
            onu?.serial_number ?? '',

        mac_address:
            onu?.mac_address ?? '',

        vendor:
            onu?.vendor ?? '',

        model:
            onu?.model ?? '',

        rx_power:
            onu?.rx_power ?? '',

        tx_power:
            onu?.tx_power ?? '',

        status:
            onu?.status ?? 'offline',

        last_seen_at:
            onu?.last_seen_at ?? '',

        installed_at:
            onu?.installed_at ?? '',

        description:
            onu?.description ?? '',
    });

    const selectedPoint =
        distributionPoints.find(
            (point) =>
                String(point.id) ===
                String(
                    data.distribution_point_id,
                ),
        );

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(
                route(
                    'onu-ont.update',
                    onu.id,
                ),
            );

            return;
        }

        post(route('onu-ont.store'));
    }

    function cancel() {
        router.visit(
            isEditing
                ? route(
                      'onu-ont.show',
                      onu.id,
                  )
                : route(
                      'onu-ont.index',
                  ),
        );
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="ONU / ONT Information"
                description="Maintain device identity, network assignment, optical signal, and operational status."
                icon={Radio}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Distribution Point"
                        name="distribution_point_id"
                        error={
                            errors.distribution_point_id
                        }
                        hint={
                            selectedPoint
                                ? `${selectedPoint.splitter?.pon_port?.olt?.code ?? '-'} / ${selectedPoint.splitter?.pon_port?.name ?? '-'} / ${selectedPoint.code}`
                                : 'Assign the ONU to its field distribution point.'
                        }
                    >
                        <select
                            id="onu-distribution_point_id"
                            value={
                                data.distribution_point_id
                            }
                            onChange={(event) =>
                                setData(
                                    'distribution_point_id',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            <option value="">
                                Unassigned
                            </option>

                            {distributionPoints.map(
                                (point) => (
                                    <option
                                        key={
                                            point.id
                                        }
                                        value={
                                            point.id
                                        }
                                    >
                                        {
                                            point.code
                                        }{' '}
                                        -{' '}
                                        {
                                            point.name
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Serial Number"
                        name="serial_number"
                        error={
                            errors.serial_number
                        }
                        hint="Unique ONU / ONT device serial number."
                    >
                        <input
                            id="onu-serial_number"
                            type="text"
                            value={
                                data.serial_number
                            }
                            onChange={(event) =>
                                setData(
                                    'serial_number',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="HWTC92837465"
                            autoComplete="off"
                        />
                    </Field>

                    <Field
                        label="MAC Address"
                        name="mac_address"
                        error={
                            errors.mac_address
                        }
                    >
                        <input
                            id="onu-mac_address"
                            type="text"
                            value={
                                data.mac_address
                            }
                            onChange={(event) =>
                                setData(
                                    'mac_address',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="A4:52:6F:11:22:33"
                            autoComplete="off"
                        />
                    </Field>

                    <Field
                        label="Status"
                        name="status"
                        error={errors.status}
                    >
                        <select
                            id="onu-status"
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
                        label="Vendor"
                        name="vendor"
                        error={errors.vendor}
                    >
                        <input
                            id="onu-vendor"
                            type="text"
                            value={data.vendor}
                            onChange={(event) =>
                                setData(
                                    'vendor',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="Huawei"
                        />
                    </Field>

                    <Field
                        label="Model"
                        name="model"
                        error={errors.model}
                    >
                        <input
                            id="onu-model"
                            type="text"
                            value={data.model}
                            onChange={(event) =>
                                setData(
                                    'model',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="HG8245H"
                        />
                    </Field>

                    <Field
                        label="Rx Power (dBm)"
                        name="rx_power"
                        error={
                            errors.rx_power
                        }
                        hint="Demo optical receive-power value."
                    >
                        <input
                            id="onu-rx_power"
                            type="number"
                            step="0.01"
                            value={
                                data.rx_power
                            }
                            onChange={(event) =>
                                setData(
                                    'rx_power',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="-21.50"
                        />
                    </Field>

                    <Field
                        label="Tx Power (dBm)"
                        name="tx_power"
                        error={
                            errors.tx_power
                        }
                    >
                        <input
                            id="onu-tx_power"
                            type="number"
                            step="0.01"
                            value={
                                data.tx_power
                            }
                            onChange={(event) =>
                                setData(
                                    'tx_power',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="2.30"
                        />
                    </Field>

                    <Field
                        label="Installed At"
                        name="installed_at"
                        error={
                            errors.installed_at
                        }
                    >
                        <input
                            id="onu-installed_at"
                            type="datetime-local"
                            value={
                                data.installed_at
                            }
                            onChange={(event) =>
                                setData(
                                    'installed_at',
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
                        label="Last Seen At"
                        name="last_seen_at"
                        error={
                            errors.last_seen_at
                        }
                    >
                        <input
                            id="onu-last_seen_at"
                            type="datetime-local"
                            value={
                                data.last_seen_at
                            }
                            onChange={(event) =>
                                setData(
                                    'last_seen_at',
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
                        label="Description"
                        name="description"
                        error={
                            errors.description
                        }
                        className="md:col-span-2"
                    >
                        <textarea
                            id="onu-description"
                            value={
                                data.description
                            }
                            onChange={(event) =>
                                setData(
                                    'description',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                textareaClassName
                            }
                            placeholder="Installation notes, optical details, device notes, or field information."
                        />
                    </Field>
                </div>
            </Card>

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
