import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Cable,
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
                htmlFor={`pon-${name}`}
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

export default function PonPortForm({
    port,
    olts,
    statuses,
    submitLabel,
}) {
    const isEditing = Boolean(port?.id);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        olt_id: port?.olt_id ?? '',
        name: port?.name ?? '',
        port_number: port?.port_number ?? '',
        capacity: port?.capacity ?? 128,
        status: port?.status ?? 'active',
        description: port?.description ?? '',
    });

    const selectedOlt = olts.find(
        (olt) =>
            String(olt.id) ===
            String(data.olt_id),
    );

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(
                route(
                    'pon-ports.update',
                    port.id,
                ),
            );

            return;
        }

        post(route('pon-ports.store'));
    }

    function cancel() {
        router.visit(
            isEditing
                ? route(
                      'pon-ports.show',
                      port.id,
                  )
                : route(
                      'pon-ports.index',
                  ),
        );
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="PON Port Information"
                description="Assign the port to an OLT and maintain its interface number, capacity, and operational status."
                icon={Cable}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="OLT"
                        name="olt_id"
                        error={errors.olt_id}
                        hint={
                            selectedOlt
                                ? `${selectedOlt.code} supports ${selectedOlt.total_pon_ports} PON ports.`
                                : 'Select the parent OLT for this PON port.'
                        }
                    >
                        <select
                            id="pon-olt_id"
                            value={data.olt_id}
                            onChange={(event) =>
                                setData(
                                    'olt_id',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                        >
                            <option value="">
                                Select OLT
                            </option>

                            {olts.map((olt) => (
                                <option
                                    key={olt.id}
                                    value={olt.id}
                                >
                                    {olt.code} -{' '}
                                    {olt.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        label="PON Name"
                        name="name"
                        error={errors.name}
                        hint="Example: PON-01"
                    >
                        <input
                            id="pon-name"
                            type="text"
                            value={data.name}
                            onChange={(event) =>
                                setData(
                                    'name',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                            placeholder="PON-01"
                            autoComplete="off"
                        />
                    </Field>

                    <Field
                        label="Port Number"
                        name="port_number"
                        error={errors.port_number}
                        hint={
                            selectedOlt
                                ? `Valid range: 1-${selectedOlt.total_pon_ports}`
                                : 'Select an OLT first.'
                        }
                    >
                        <input
                            id="pon-port_number"
                            type="number"
                            min="1"
                            max={
                                selectedOlt
                                    ?.total_pon_ports ||
                                undefined
                            }
                            value={
                                data.port_number
                            }
                            onChange={(event) =>
                                setData(
                                    'port_number',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                            placeholder="1"
                        />
                    </Field>

                    <Field
                        label="Capacity"
                        name="capacity"
                        error={errors.capacity}
                        hint="Maximum subscriber/ONU capacity planned for this PON."
                    >
                        <input
                            id="pon-capacity"
                            type="number"
                            min="1"
                            max="65535"
                            value={data.capacity}
                            onChange={(event) =>
                                setData(
                                    'capacity',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                        />
                    </Field>

                    <Field
                        label="Status"
                        name="status"
                        error={errors.status}
                    >
                        <select
                            id="pon-status"
                            value={data.status}
                            onChange={(event) =>
                                setData(
                                    'status',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
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
                        label="Description"
                        name="description"
                        error={errors.description}
                        className="md:col-span-2"
                    >
                        <textarea
                            id="pon-description"
                            value={
                                data.description
                            }
                            onChange={(event) =>
                                setData(
                                    'description',
                                    event.target.value,
                                )
                            }
                            className={
                                textareaClassName
                            }
                            placeholder="Port notes, service area, splitter path, or operational context."
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
