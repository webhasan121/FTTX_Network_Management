import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Server } from 'lucide-react';

const inputClassName =
    'block h-10 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const textareaClassName =
    'block min-h-28 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

function Field({ label, name, error, children, hint, className = '' }) {
    return (
        <div className={className}>
            <label htmlFor={`olt-${name}`} className="text-sm font-medium text-zinc-700">
                {label}
            </label>
            <div className="mt-2">{children}</div>
            {hint && !error && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export default function OltForm({ olt, statuses, submitLabel }) {
    const isEditing = Boolean(olt?.id);
    const { data, setData, post, put, processing, errors } = useForm({
        name: olt?.name ?? '',
        code: olt?.code ?? '',
        vendor: olt?.vendor ?? '',
        model: olt?.model ?? '',
        ip_address: olt?.ip_address ?? '',
        location_name: olt?.location_name ?? '',
        latitude: olt?.latitude ?? '',
        longitude: olt?.longitude ?? '',
        total_pon_ports: olt?.total_pon_ports ?? 0,
        status: olt?.status ?? 'offline',
        description: olt?.description ?? '',
    });

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(route('olts.update', olt.id));

            return;
        }

        post(route('olts.store'));
    }

    function cancel() {
        router.visit(isEditing ? route('olts.show', olt.id) : route('olts.index'));
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="OLT Information"
                description="Maintain the core device identity, management address, POP location, and operational status."
                icon={Server}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Name" name="name" error={errors.name}>
                        <input
                            id="olt-name"
                            type="text"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            className={inputClassName}
                            placeholder="Banani Central POP OLT"
                            autoComplete="off"
                        />
                    </Field>

                    <Field label="Code" name="code" error={errors.code} hint="Example: OLT-BAN-001">
                        <input
                            id="olt-code"
                            type="text"
                            value={data.code}
                            onChange={(event) => setData('code', event.target.value)}
                            className={inputClassName}
                            placeholder="OLT-BAN-001"
                            autoComplete="off"
                        />
                    </Field>

                    <Field label="Vendor" name="vendor" error={errors.vendor}>
                        <input
                            id="olt-vendor"
                            type="text"
                            value={data.vendor}
                            onChange={(event) => setData('vendor', event.target.value)}
                            className={inputClassName}
                            placeholder="Huawei"
                            autoComplete="off"
                        />
                    </Field>

                    <Field label="Model" name="model" error={errors.model}>
                        <input
                            id="olt-model"
                            type="text"
                            value={data.model}
                            onChange={(event) => setData('model', event.target.value)}
                            className={inputClassName}
                            placeholder="MA5800-X7"
                            autoComplete="off"
                        />
                    </Field>

                    <Field label="Management IP" name="ip_address" error={errors.ip_address}>
                        <input
                            id="olt-ip_address"
                            type="text"
                            value={data.ip_address}
                            onChange={(event) => setData('ip_address', event.target.value)}
                            className={inputClassName}
                            placeholder="10.10.1.2"
                            autoComplete="off"
                        />
                    </Field>

                    <Field label="Status" name="status" error={errors.status}>
                        <select
                            id="olt-status"
                            value={data.status}
                            onChange={(event) => setData('status', event.target.value)}
                            className={inputClassName}
                        >
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Location Name" name="location_name" error={errors.location_name}>
                        <input
                            id="olt-location_name"
                            type="text"
                            value={data.location_name}
                            onChange={(event) => setData('location_name', event.target.value)}
                            className={inputClassName}
                            placeholder="Banani Central POP"
                            autoComplete="off"
                        />
                    </Field>

                    <Field label="Total PON Ports" name="total_pon_ports" error={errors.total_pon_ports}>
                        <input
                            id="olt-total_pon_ports"
                            type="number"
                            min="0"
                            max="65535"
                            value={data.total_pon_ports}
                            onChange={(event) => setData('total_pon_ports', event.target.value)}
                            className={inputClassName}
                        />
                    </Field>

                    <Field label="Latitude" name="latitude" error={errors.latitude}>
                        <input
                            id="olt-latitude"
                            type="number"
                            step="0.0000001"
                            min="-90"
                            max="90"
                            value={data.latitude}
                            onChange={(event) => setData('latitude', event.target.value)}
                            className={inputClassName}
                            placeholder="23.7939000"
                        />
                    </Field>

                    <Field label="Longitude" name="longitude" error={errors.longitude}>
                        <input
                            id="olt-longitude"
                            type="number"
                            step="0.0000001"
                            min="-180"
                            max="180"
                            value={data.longitude}
                            onChange={(event) => setData('longitude', event.target.value)}
                            className={inputClassName}
                            placeholder="90.4066000"
                        />
                    </Field>

                    <Field
                        label="Description"
                        name="description"
                        error={errors.description}
                        className="md:col-span-2"
                    >
                        <textarea
                            id="olt-description"
                            value={data.description}
                            onChange={(event) => setData('description', event.target.value)}
                            className={textareaClassName}
                            placeholder="Operational notes, POP coverage, or maintenance context."
                        />
                    </Field>
                </div>
            </Card>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    icon={ArrowLeft}
                    onClick={cancel}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Save} disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
