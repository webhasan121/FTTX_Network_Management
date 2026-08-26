import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    GitBranch,
    Save,
} from 'lucide-react';

const inputClassName =
    'block h-10 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const textareaClassName =
    'block min-h-28 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const ratioPorts = {
    '1:2': 2,
    '1:4': 4,
    '1:8': 8,
    '1:16': 16,
    '1:32': 32,
    '1:64': 64,
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
                htmlFor={`splitter-${name}`}
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

export default function SplitterForm({
    splitter,
    ponPorts,
    ratios,
    submitLabel,
}) {
    const isEditing = Boolean(
        splitter?.id,
    );

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        pon_port_id:
            splitter?.pon_port_id ?? '',
        code: splitter?.code ?? '',
        name: splitter?.name ?? '',
        ratio: splitter?.ratio ?? '1:8',
        total_ports:
            splitter?.total_ports ?? 8,
        used_ports:
            splitter?.used_ports ?? 0,
        location_name:
            splitter?.location_name ?? '',
        latitude:
            splitter?.latitude ?? '',
        longitude:
            splitter?.longitude ?? '',
        description:
            splitter?.description ?? '',
    });

    const selectedPon = ponPorts.find(
        (port) =>
            String(port.id) ===
            String(data.pon_port_id),
    );

    function changeRatio(value) {
        setData((current) => ({
            ...current,
            ratio: value,
            total_ports:
                ratioPorts[value] ??
                current.total_ports,
        }));
    }

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(
                route(
                    'splitters.update',
                    splitter.id,
                ),
            );

            return;
        }

        post(route('splitters.store'));
    }

    function cancel() {
        router.visit(
            isEditing
                ? route(
                      'splitters.show',
                      splitter.id,
                  )
                : route(
                      'splitters.index',
                  ),
        );
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="Splitter Information"
                description="Maintain upstream PON assignment, splitter ratio, capacity, and physical field location."
                icon={GitBranch}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="PON Port"
                        name="pon_port_id"
                        error={
                            errors.pon_port_id
                        }
                        hint={
                            selectedPon
                                ? `${selectedPon.olt?.code} / ${selectedPon.name}`
                                : 'Select the upstream PON port.'
                        }
                    >
                        <select
                            id="splitter-pon_port_id"
                            value={
                                data.pon_port_id
                            }
                            onChange={(event) =>
                                setData(
                                    'pon_port_id',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            <option value="">
                                Select PON Port
                            </option>

                            {ponPorts.map(
                                (port) => (
                                    <option
                                        key={
                                            port.id
                                        }
                                        value={
                                            port.id
                                        }
                                    >
                                        {
                                            port
                                                .olt
                                                ?.code
                                        }{' '}
                                        /{' '}
                                        {
                                            port.name
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Splitter Code"
                        name="code"
                        error={errors.code}
                        hint="Example: SPL-BAN-001"
                    >
                        <input
                            id="splitter-code"
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
                            placeholder="SPL-BAN-001"
                            autoComplete="off"
                        />
                    </Field>

                    <Field
                        label="Splitter Name"
                        name="name"
                        error={errors.name}
                    >
                        <input
                            id="splitter-name"
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
                            placeholder="Banani Road 3 Splitter"
                            autoComplete="off"
                        />
                    </Field>

                    <Field
                        label="Splitter Ratio"
                        name="ratio"
                        error={errors.ratio}
                        hint="Changing ratio automatically sets total output ports."
                    >
                        <select
                            id="splitter-ratio"
                            value={data.ratio}
                            onChange={(event) =>
                                changeRatio(
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                        >
                            {ratios.map(
                                (ratio) => (
                                    <option
                                        key={ratio}
                                        value={ratio}
                                    >
                                        {ratio}
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Total Ports"
                        name="total_ports"
                        error={
                            errors.total_ports
                        }
                        hint="Automatically derived from the splitter ratio."
                    >
                        <input
                            id="splitter-total_ports"
                            type="number"
                            min="1"
                            max="64"
                            value={
                                data.total_ports
                            }
                            readOnly
                            className={`${inputClassName} bg-zinc-100`}
                        />
                    </Field>

                    <Field
                        label="Used Ports"
                        name="used_ports"
                        error={
                            errors.used_ports
                        }
                        hint={`Maximum ${data.total_ports} ports.`}
                    >
                        <input
                            id="splitter-used_ports"
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
                            id="splitter-location_name"
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
                            placeholder="Banani Road 3"
                        />
                    </Field>

                    <div />

                    <Field
                        label="Latitude"
                        name="latitude"
                        error={errors.latitude}
                    >
                        <input
                            id="splitter-latitude"
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
                            id="splitter-longitude"
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
                            id="splitter-description"
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
                            placeholder="Field notes, pole reference, cabinet details, or service area."
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
