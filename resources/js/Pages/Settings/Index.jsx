import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {
    Head,
    useForm,
} from '@inertiajs/react';

import {
    Activity,
    AlertTriangle,
    Building2,
    Database,
    Gauge,
    Mail,
    Network,
    Phone,
    Save,
    Settings,
    ShieldAlert,
    Timer,
} from 'lucide-react';

const inputClassName =
    'block h-10 w-full rounded-lg border-zinc-300 bg-white text-sm text-zinc-900 shadow-sm transition focus:border-teal-500 focus:ring-teal-500';

function Field({
    label,
    name,
    error,
    description,
    children,
}) {
    return (
        <div>
            <label
                htmlFor={`setting-${name}`}
                className="text-sm font-semibold text-zinc-800"
            >
                {label}
            </label>

            {description && (
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {description}
                </p>
            )}

            <div className="mt-2">
                {children}
            </div>

            <InputError
                message={error}
                className="mt-2"
            />
        </div>
    );
}

function InfoItem({
    label,
    value,
}) {
    return (
        <div className="p-4 border rounded-xl border-zinc-200 bg-zinc-50">
            <p className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
                {label}
            </p>

            <p className="mt-2 text-sm font-semibold text-zinc-950">
                {value || 'Not available'}
            </p>
        </div>
    );
}

export default function Index({
    settings,
    users,
    timezones,
    severities,
    systemInfo,
}) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
    } = useForm({
        application_name:
            settings.application_name ?? '',

        company_name:
            settings.company_name ?? '',

        support_email:
            settings.support_email ?? '',

        support_phone:
            settings.support_phone ?? '',

        timezone:
            settings.timezone ??
            'Asia/Dhaka',

        onu_warning_rx_power:
            settings.onu_warning_rx_power ??
            -25,

        onu_critical_rx_power:
            settings.onu_critical_rx_power ??
            -28,

        onu_offline_timeout:
            settings.onu_offline_timeout ??
            5,

        pon_utilization_warning:
            settings.pon_utilization_warning ??
            80,

        default_fault_severity:
            settings.default_fault_severity ??
            'medium',

        default_fault_assignee_id:
            settings.default_fault_assignee_id ??
            '',

        auto_resolve_faults:
            Boolean(
                settings.auto_resolve_faults
            ),
    });

    function submit(event) {
        event.preventDefault();

        put(
            route('settings.update'),
            {
                preserveScroll: true,
            }
        );
    }

    return (
        <AuthenticatedLayout
            title="Settings"
            subtitle="Configure system defaults and network monitoring thresholds."
        >
            <Head title="Settings" />

            <PageHeader
                eyebrow="Administration"
                title="System Settings"
                description="Configure application information, monitoring thresholds, and default fault management behavior."
                actions={
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && (
                            <StatusBadge tone="online">
                                Saved
                            </StatusBadge>
                        )}

                        <Button
                            type="submit"
                            form="settings-form"
                            variant="primary"
                            icon={Save}
                            disabled={processing}
                        >
                            {processing
                                ? 'Saving...'
                                : 'Save Settings'}
                        </Button>
                    </div>
                }
            />

            <form
                id="settings-form"
                onSubmit={submit}
                className="mt-6 space-y-6"
            >
                {/* General Settings */}
                <Card
                    title="General Settings"
                    description="Basic application and company information."
                    icon={Building2}
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field
                            label="Application Name"
                            name="application_name"
                            error={
                                errors.application_name
                            }
                        >
                            <div className="relative">
                                <Settings className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-application_name"
                                    type="text"
                                    value={
                                        data.application_name
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'application_name',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field
                            label="Company Name"
                            name="company_name"
                            error={
                                errors.company_name
                            }
                        >
                            <div className="relative">
                                <Building2 className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-company_name"
                                    type="text"
                                    value={
                                        data.company_name
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'company_name',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9`}
                                    placeholder="Asiatel Network Ltd."
                                />
                            </div>
                        </Field>

                        <Field
                            label="Support Email"
                            name="support_email"
                            error={
                                errors.support_email
                            }
                        >
                            <div className="relative">
                                <Mail className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-support_email"
                                    type="email"
                                    value={
                                        data.support_email
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'support_email',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9`}
                                    placeholder="support@example.com"
                                />
                            </div>
                        </Field>

                        <Field
                            label="Support Phone"
                            name="support_phone"
                            error={
                                errors.support_phone
                            }
                        >
                            <div className="relative">
                                <Phone className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-support_phone"
                                    type="text"
                                    value={
                                        data.support_phone
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'support_phone',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9`}
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>
                        </Field>

                        <Field
                            label="Timezone"
                            name="timezone"
                            error={errors.timezone}
                            description="Timezone used for network events and fault timestamps."
                        >
                            <select
                                id="setting-timezone"
                                value={data.timezone}
                                onChange={(event) =>
                                    setData(
                                        'timezone',
                                        event.target.value
                                    )
                                }
                                className={inputClassName}
                            >
                                {timezones.map(
                                    (timezone) => (
                                        <option
                                            key={
                                                timezone.value
                                            }
                                            value={
                                                timezone.value
                                            }
                                        >
                                            {
                                                timezone.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </Field>
                    </div>
                </Card>

                {/* Network Settings */}
                <Card
                    title="Network Monitoring"
                    description="Default thresholds used to classify network health conditions."
                    icon={Activity}
                >
                    <div className="p-4 mb-5 border rounded-xl border-sky-100 bg-sky-50">
                        <div className="flex gap-3">
                            <Network className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />

                            <div>
                                <p className="text-sm font-semibold text-sky-950">
                                    Monitoring Thresholds
                                </p>

                                <p className="mt-1 text-xs leading-5 text-sky-700">
                                    These values can later
                                    be applied to live OLT
                                    telemetry received via
                                    SNMP, API, or device
                                    integration.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Field
                            label="ONU Warning RX Power"
                            name="onu_warning_rx_power"
                            error={
                                errors.onu_warning_rx_power
                            }
                            description="Signal level where an ONU should enter a warning state."
                        >
                            <div className="relative">
                                <Gauge className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-onu_warning_rx_power"
                                    type="number"
                                    step="0.01"
                                    value={
                                        data.onu_warning_rx_power
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'onu_warning_rx_power',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9 pr-14`}
                                />

                                <span className="absolute text-xs font-semibold -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-400">
                                    dBm
                                </span>
                            </div>
                        </Field>

                        <Field
                            label="ONU Critical RX Power"
                            name="onu_critical_rx_power"
                            error={
                                errors.onu_critical_rx_power
                            }
                            description="Signal level where an ONU should be classified as critical."
                        >
                            <div className="relative">
                                <ShieldAlert className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-onu_critical_rx_power"
                                    type="number"
                                    step="0.01"
                                    value={
                                        data.onu_critical_rx_power
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'onu_critical_rx_power',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9 pr-14`}
                                />

                                <span className="absolute text-xs font-semibold -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-400">
                                    dBm
                                </span>
                            </div>
                        </Field>

                        <Field
                            label="ONU Offline Timeout"
                            name="onu_offline_timeout"
                            error={
                                errors.onu_offline_timeout
                            }
                            description="Time without telemetry before an ONU is considered offline."
                        >
                            <div className="relative">
                                <Timer className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-onu_offline_timeout"
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={
                                        data.onu_offline_timeout
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'onu_offline_timeout',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9 pr-20`}
                                />

                                <span className="absolute text-xs font-semibold -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-400">
                                    Minutes
                                </span>
                            </div>
                        </Field>

                        <Field
                            label="PON Utilization Warning"
                            name="pon_utilization_warning"
                            error={
                                errors.pon_utilization_warning
                            }
                            description="Utilization percentage that should trigger a capacity warning."
                        >
                            <div className="relative">
                                <Activity className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                                <input
                                    id="setting-pon_utilization_warning"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={
                                        data.pon_utilization_warning
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'pon_utilization_warning',
                                            event.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-9 pr-10`}
                                />

                                <span className="absolute text-xs font-semibold -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-400">
                                    %
                                </span>
                            </div>
                        </Field>
                    </div>
                </Card>

                {/* Fault Defaults */}
                <Card
                    title="Fault Management"
                    description="Configure default values used when creating network fault records."
                    icon={AlertTriangle}
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field
                            label="Default Fault Severity"
                            name="default_fault_severity"
                            error={
                                errors.default_fault_severity
                            }
                        >
                            <select
                                id="setting-default_fault_severity"
                                value={
                                    data.default_fault_severity
                                }
                                onChange={(event) =>
                                    setData(
                                        'default_fault_severity',
                                        event.target.value
                                    )
                                }
                                className={inputClassName}
                            >
                                {severities.map(
                                    (severity) => (
                                        <option
                                            key={
                                                severity.value
                                            }
                                            value={
                                                severity.value
                                            }
                                        >
                                            {
                                                severity.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </Field>

                        <Field
                            label="Default Assignee"
                            name="default_fault_assignee_id"
                            error={
                                errors.default_fault_assignee_id
                            }
                        >
                            <select
                                id="setting-default_fault_assignee_id"
                                value={
                                    data.default_fault_assignee_id
                                }
                                onChange={(event) =>
                                    setData(
                                        'default_fault_assignee_id',
                                        event.target.value
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

                        <div className="md:col-span-2">
                            <label className="flex items-start gap-3 p-4 border cursor-pointer rounded-xl border-zinc-200 bg-zinc-50">
                                <input
                                    type="checkbox"
                                    checked={
                                        data.auto_resolve_faults
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'auto_resolve_faults',
                                            event.target.checked
                                        )
                                    }
                                    className="mt-0.5 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">
                                        Auto Resolve Faults
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Automatically mark
                                        eligible faults as
                                        resolved after future
                                        monitoring confirms
                                        that the network
                                        condition has returned
                                        to normal.
                                    </p>
                                </div>
                            </label>

                            <InputError
                                message={
                                    errors.auto_resolve_faults
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>
                </Card>
            </form>

            {/* System Information */}
            <Card
                className="mt-6"
                title="System Information"
                description="Read-only technical information about this application."
                icon={Database}
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                        label="Application Version"
                        value={
                            systemInfo.application_version
                        }
                    />

                    <InfoItem
                        label="Laravel"
                        value={
                            systemInfo.laravel
                        }
                    />

                    <InfoItem
                        label="PHP"
                        value={systemInfo.php}
                    />

                    <InfoItem
                        label="Frontend"
                        value={
                            systemInfo.frontend
                        }
                    />

                    <InfoItem
                        label="Database"
                        value={
                            systemInfo.database
                        }
                    />

                    <InfoItem
                        label="Environment"
                        value={
                            systemInfo.environment
                        }
                    />
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
