import React from 'react';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import StatusBadge from '@/Components/UI/StatusBadge';
import { router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Save,
} from 'lucide-react';

const inputClassName =
    'block h-10 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const textareaClassName =
    'block min-h-32 w-full rounded-lg border-zinc-300 text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

const severityTone = {
    low: 'neutral',
    medium: 'info',
    high: 'warning',
    critical: 'critical',
};

function Field({
    label,
    name,
    error,
    hint,
    children,
    className = '',
}) {
    return (
        <div className={className}>
            <label
                htmlFor={`fault-${name}`}
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

function determineAssetType(fault) {
    if (fault?.onu_id) {
        return 'onu';
    }

    if (fault?.distribution_point_id) {
        return 'distribution';
    }

    if (fault?.pon_port_id) {
        return 'pon';
    }

    if (fault?.olt_id) {
        return 'olt';
    }

    return '';
}

export default function FaultForm({
    fault,
    statuses,
    severities,
    faultTypes,
    olts,
    ponPorts,
    distributionPoints,
    onus,
    users,
    submitLabel,
}) {
    const isEditing = Boolean(fault?.id);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        title: fault?.title ?? '',

        fault_type:
            fault?.fault_type ??
            'onu_offline',

        severity:
            fault?.severity ?? 'medium',

        status:
            fault?.status ?? 'open',

        olt_id:
            fault?.olt_id ?? '',

        pon_port_id:
            fault?.pon_port_id ?? '',

        distribution_point_id:
            fault?.distribution_point_id ??
            '',

        onu_id:
            fault?.onu_id ?? '',

        assigned_to:
            fault?.assigned_to ?? '',

        reported_at:
            fault?.reported_at ?? '',

        resolved_at:
            fault?.resolved_at ?? '',

        description:
            fault?.description ?? '',
    });

    const [assetType, setAssetType] =
        React.useState(
            determineAssetType(fault),
        );

    function changeAssetType(type) {
        setAssetType(type);

        setData((current) => ({
            ...current,
            olt_id: '',
            pon_port_id: '',
            distribution_point_id: '',
            onu_id: '',
        }));
    }

    function changeAsset(value) {
        setData((current) => ({
            ...current,

            olt_id:
                assetType === 'olt'
                    ? value
                    : '',

            pon_port_id:
                assetType === 'pon'
                    ? value
                    : '',

            distribution_point_id:
                assetType ===
                'distribution'
                    ? value
                    : '',

            onu_id:
                assetType === 'onu'
                    ? value
                    : '',
        }));
    }

    function selectedAssetValue() {
        switch (assetType) {
            case 'olt':
                return data.olt_id;

            case 'pon':
                return data.pon_port_id;

            case 'distribution':
                return data.distribution_point_id;

            case 'onu':
                return data.onu_id;

            default:
                return '';
        }
    }

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(
                route(
                    'faults.update',
                    fault.id,
                ),
            );

            return;
        }

        post(route('faults.store'));
    }

    function cancel() {
        router.visit(
            isEditing
                ? route(
                      'faults.show',
                      fault.id,
                  )
                : route('faults.index'),
        );
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="Fault Information"
                description="Record the incident, affected network asset, severity, assignment, and resolution status."
                icon={AlertTriangle}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Fault Title"
                        name="title"
                        error={errors.title}
                        className="md:col-span-2"
                    >
                        <input
                            id="fault-title"
                            type="text"
                            value={data.title}
                            onChange={(event) =>
                                setData(
                                    'title',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                            placeholder="ONU LOS at Banani Road 11"
                        />
                    </Field>

                    <Field
                        label="Fault Type"
                        name="fault_type"
                        error={errors.fault_type}
                    >
                        <select
                            id="fault-fault_type"
                            value={data.fault_type}
                            onChange={(event) =>
                                setData(
                                    'fault_type',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                        >
                            {faultTypes.map(
                                (item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Severity"
                        name="severity"
                        error={errors.severity}
                    >
                        <div className="flex gap-3">
                            <select
                                id="fault-severity"
                                value={data.severity}
                                onChange={(event) =>
                                    setData(
                                        'severity',
                                        event.target.value,
                                    )
                                }
                                className={inputClassName}
                            >
                                {severities.map(
                                    (item) => (
                                        <option
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    ),
                                )}
                            </select>

                            <div className="flex items-center shrink-0">
                                <StatusBadge
                                    tone={
                                        severityTone[
                                            data.severity
                                        ] ?? 'neutral'
                                    }
                                >
                                    {data.severity}
                                </StatusBadge>
                            </div>
                        </div>
                    </Field>

                    <Field
                        label="Status"
                        name="status"
                        error={errors.status}
                    >
                        <select
                            id="fault-status"
                            value={data.status}
                            onChange={(event) => {
                                const value =
                                    event.target.value;

                                setData(
                                    (current) => ({
                                        ...current,
                                        status: value,

                                        resolved_at:
                                            value ===
                                            'resolved'
                                                ? current.resolved_at
                                                : '',
                                    }),
                                );
                            }}
                            className={inputClassName}
                        >
                            {statuses.map(
                                (item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Assigned To"
                        name="assigned_to"
                        error={errors.assigned_to}
                    >
                        <select
                            id="fault-assigned_to"
                            value={data.assigned_to}
                            onChange={(event) =>
                                setData(
                                    'assigned_to',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                        >
                            <option value="">
                                Unassigned
                            </option>

                            {users.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name} -{' '}
                                    {user.role}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
            </Card>

            <Card
                className="mt-6"
                title="Affected Network Asset"
                description="Choose the main network component associated with this fault."
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Asset Type"
                        name="asset_type"
                    >
                        <select
                            id="fault-asset_type"
                            value={assetType}
                            onChange={(event) =>
                                changeAssetType(
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                        >
                            <option value="">
                                General / No Asset
                            </option>

                            <option value="olt">
                                OLT
                            </option>

                            <option value="pon">
                                PON Port
                            </option>

                            <option value="distribution">
                                Distribution Point
                            </option>

                            <option value="onu">
                                ONU / ONT
                            </option>
                        </select>
                    </Field>

                    <Field
                        label="Network Asset"
                        name="asset"
                        error={
                            errors.olt_id ||
                            errors.pon_port_id ||
                            errors.distribution_point_id ||
                            errors.onu_id
                        }
                    >
                        <select
                            id="fault-asset"
                            value={selectedAssetValue()}
                            disabled={!assetType}
                            onChange={(event) =>
                                changeAsset(
                                    event.target.value,
                                )
                            }
                            className={`${inputClassName} ${
                                !assetType
                                    ? 'cursor-not-allowed bg-zinc-100'
                                    : ''
                            }`}
                        >
                            <option value="">
                                Select Asset
                            </option>

                            {assetType ===
                                'olt' &&
                                olts.map((olt) => (
                                    <option
                                        key={olt.id}
                                        value={olt.id}
                                    >
                                        {olt.code} -{' '}
                                        {olt.name}
                                    </option>
                                ))}

                            {assetType ===
                                'pon' &&
                                ponPorts.map(
                                    (pon) => (
                                        <option
                                            key={pon.id}
                                            value={pon.id}
                                        >
                                            {pon.olt?.code}{' '}
                                            / {pon.name}
                                        </option>
                                    ),
                                )}

                            {assetType ===
                                'distribution' &&
                                distributionPoints.map(
                                    (point) => (
                                        <option
                                            key={point.id}
                                            value={point.id}
                                        >
                                            {point.code} -{' '}
                                            {point.name}
                                        </option>
                                    ),
                                )}

                            {assetType ===
                                'onu' &&
                                onus.map((onu) => (
                                    <option
                                        key={onu.id}
                                        value={onu.id}
                                    >
                                        {onu.serial_number}{' '}
                                        - {onu.status}
                                    </option>
                                ))}
                        </select>
                    </Field>
                </div>
            </Card>

            <Card
                className="mt-6"
                title="Incident Timeline"
                description="Track when the problem was reported and when it was resolved."
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Reported At"
                        name="reported_at"
                        error={errors.reported_at}
                    >
                        <input
                            id="fault-reported_at"
                            type="datetime-local"
                            value={data.reported_at}
                            onChange={(event) =>
                                setData(
                                    'reported_at',
                                    event.target.value,
                                )
                            }
                            className={inputClassName}
                        />
                    </Field>

                    <Field
                        label="Resolved At"
                        name="resolved_at"
                        error={errors.resolved_at}
                        hint={
                            data.status ===
                            'resolved'
                                ? 'Leave empty to use the current time automatically.'
                                : 'Available when the fault is resolved.'
                        }
                    >
                        <input
                            id="fault-resolved_at"
                            type="datetime-local"
                            value={data.resolved_at}
                            disabled={
                                data.status !==
                                'resolved'
                            }
                            onChange={(event) =>
                                setData(
                                    'resolved_at',
                                    event.target.value,
                                )
                            }
                            className={`${inputClassName} ${
                                data.status !==
                                'resolved'
                                    ? 'cursor-not-allowed bg-zinc-100'
                                    : ''
                            }`}
                        />
                    </Field>

                    <Field
                        label="Description"
                        name="description"
                        error={errors.description}
                        className="md:col-span-2"
                    >
                        <textarea
                            id="fault-description"
                            value={data.description}
                            onChange={(event) =>
                                setData(
                                    'description',
                                    event.target.value,
                                )
                            }
                            className={textareaClassName}
                            placeholder="Describe symptoms, troubleshooting information, customer impact, or technician notes."
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
