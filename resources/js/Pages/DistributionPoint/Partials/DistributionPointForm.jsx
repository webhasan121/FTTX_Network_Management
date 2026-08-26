import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Box,
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
                htmlFor={`point-${name}`}
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

export default function DistributionPointForm({
    point,
    splitters,
    types,
    submitLabel,
}) {
    const isEditing = Boolean(point?.id);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        splitter_id:
            point?.splitter_id ?? '',
        code: point?.code ?? '',
        name: point?.name ?? '',
        type: point?.type ?? 'fdb',
        total_ports:
            point?.total_ports ?? 16,
        used_ports:
            point?.used_ports ?? 0,
        location_name:
            point?.location_name ?? '',
        address:
            point?.address ?? '',
        latitude:
            point?.latitude ?? '',
        longitude:
            point?.longitude ?? '',
        description:
            point?.description ?? '',
    });

    const selectedSplitter =
        splitters.find(
            (splitter) =>
                String(splitter.id) ===
                String(data.splitter_id),
        );

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(
                route(
                    'distribution-points.update',
                    point.id,
                ),
            );

            return;
        }

        post(
            route(
                'distribution-points.store',
            ),
        );
    }

    function cancel() {
        router.visit(
            isEditing
                ? route(
                      'distribution-points.show',
                      point.id,
                  )
                : route(
                      'distribution-points.index',
                  ),
        );
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="Distribution Point Information"
                description="Maintain splitter assignment, node type, port capacity, and physical field location."
                icon={Box}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Splitter"
                        name="splitter_id"
                        error={errors.splitter_id}
                        hint={
                            selectedSplitter
                                ? `${selectedSplitter.code} / ${selectedSplitter.pon_port?.olt?.code} / ${selectedSplitter.pon_port?.name}`
                                : 'Select the upstream splitter.'
                        }
                    >
                        <select
                            id="point-splitter_id"
                            value={
                                data.splitter_id
                            }
                            onChange={(event) =>
                                setData(
                                    'splitter_id',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            <option value="">
                                Select Splitter
                            </option>

                            {splitters.map(
                                (splitter) => (
                                    <option
                                        key={
                                            splitter.id
                                        }
                                        value={
                                            splitter.id
                                        }
                                    >
                                        {
                                            splitter.code
                                        }{' '}
                                        -{' '}
                                        {
                                            splitter.name
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Type"
                        name="type"
                        error={errors.type}
                    >
                        <select
                            id="point-type"
                            value={data.type}
                            onChange={(event) =>
                                setData(
                                    'type',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            {types.map(
                                (type) => (
                                    <option
                                        key={
                                            type.value
                                        }
                                        value={
                                            type.value
                                        }
                                    >
                                        {
                                            type.label
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Code"
                        name="code"
                        error={errors.code}
                        hint="Example: FDB-BAN-001"
                    >
                        <input
                            id="point-code"
                            type="text"
                            value={data.code}
                            onChange={(event) =>
                                setData(
                                    'code',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="FDB-BAN-001"
                        />
                    </Field>

                    <Field
                        label="Name"
                        name="name"
                        error={errors.name}
                    >
                        <input
                            id="point-name"
                            type="text"
                            value={data.name}
                            onChange={(event) =>
                                setData(
                                    'name',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="Banani Road 11 FDB"
                        />
                    </Field>

                    <Field
                        label="Total Ports"
                        name="total_ports"
                        error={
                            errors.total_ports
                        }
                    >
                        <input
                            id="point-total_ports"
                            type="number"
                            min="1"
                            max="128"
                            value={
                                data.total_ports
                            }
                            onChange={(event) =>
                                setData(
                                    'total_ports',
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
                        label="Used Ports"
                        name="used_ports"
                        error={
                            errors.used_ports
                        }
                        hint={`Cannot exceed ${data.total_ports || 0}.`}
                    >
                        <input
                            id="point-used_ports"
                            type="number"
                            min="0"
                            max={
                                data.total_ports
                            }
                            value={
                                data.used_ports
                            }
                            onChange={(event) =>
                                setData(
                                    'used_ports',
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
                        label="Location Name"
                        name="location_name"
                        error={
                            errors.location_name
                        }
                    >
                        <input
                            id="point-location_name"
                            type="text"
                            value={
                                data.location_name
                            }
                            onChange={(event) =>
                                setData(
                                    'location_name',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="Banani Road 11"
                        />
                    </Field>

                    <Field
                        label="Address"
                        name="address"
                        error={errors.address}
                    >
                        <input
                            id="point-address"
                            type="text"
                            value={data.address}
                            onChange={(event) =>
                                setData(
                                    'address',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="Road 11, Banani, Dhaka"
                        />
                    </Field>

                    <Field
                        label="Latitude"
                        name="latitude"
                        error={errors.latitude}
                    >
                        <input
                            id="point-latitude"
                            type="number"
                            step="0.0000001"
                            min="-90"
                            max="90"
                            value={
                                data.latitude
                            }
                            onChange={(event) =>
                                setData(
                                    'latitude',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="23.7939000"
                        />
                    </Field>

                    <Field
                        label="Longitude"
                        name="longitude"
                        error={
                            errors.longitude
                        }
                    >
                        <input
                            id="point-longitude"
                            type="number"
                            step="0.0000001"
                            min="-180"
                            max="180"
                            value={
                                data.longitude
                            }
                            onChange={(event) =>
                                setData(
                                    'longitude',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="90.4066000"
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
                            id="point-description"
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
                            placeholder="Field notes, cabinet details, pole reference, or service area."
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
