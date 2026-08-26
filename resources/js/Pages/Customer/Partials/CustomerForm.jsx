import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import InputError from '@/Components/InputError';
import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    User,
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
                htmlFor={`customer-${name}`}
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

export default function CustomerForm({
    customer,
    statuses,
    submitLabel,
}) {
    const isEditing = Boolean(
        customer?.id,
    );

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        customer_code:
            customer?.customer_code ?? '',

        name:
            customer?.name ?? '',

        phone:
            customer?.phone ?? '',

        email:
            customer?.email ?? '',

        address:
            customer?.address ?? '',

        area:
            customer?.area ?? '',

        latitude:
            customer?.latitude ?? '',

        longitude:
            customer?.longitude ?? '',

        status:
            customer?.status ?? 'active',
    });

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(
                route(
                    'customers.update',
                    customer.id,
                ),
            );

            return;
        }

        post(route('customers.store'));
    }

    function cancel() {
        router.visit(
            isEditing
                ? route(
                      'customers.show',
                      customer.id,
                  )
                : route(
                      'customers.index',
                  ),
        );
    }

    return (
        <form onSubmit={submit}>
            <Card
                title="Customer Information"
                description="Maintain subscriber identity, contact details, service area, and location information."
                icon={User}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Customer Code"
                        name="customer_code"
                        error={
                            errors.customer_code
                        }
                        hint="Unique customer reference. Example: CUS-00125"
                    >
                        <input
                            id="customer-customer_code"
                            type="text"
                            value={
                                data.customer_code
                            }
                            onChange={(event) =>
                                setData(
                                    'customer_code',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="CUS-00125"
                        />
                    </Field>

                    <Field
                        label="Customer Status"
                        name="status"
                        error={errors.status}
                    >
                        <select
                            id="customer-status"
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
                        label="Full Name"
                        name="name"
                        error={errors.name}
                    >
                        <input
                            id="customer-name"
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
                            placeholder="Md. Rahim Ahmed"
                        />
                    </Field>

                    <Field
                        label="Phone"
                        name="phone"
                        error={errors.phone}
                    >
                        <input
                            id="customer-phone"
                            type="text"
                            value={data.phone}
                            onChange={(event) =>
                                setData(
                                    'phone',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="017XXXXXXXX"
                        />
                    </Field>

                    <Field
                        label="Email"
                        name="email"
                        error={errors.email}
                    >
                        <input
                            id="customer-email"
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                setData(
                                    'email',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="customer@example.com"
                        />
                    </Field>

                    <Field
                        label="Area"
                        name="area"
                        error={errors.area}
                    >
                        <input
                            id="customer-area"
                            type="text"
                            value={data.area}
                            onChange={(event) =>
                                setData(
                                    'area',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClassName
                            }
                            placeholder="Banani"
                        />
                    </Field>

                    <Field
                        label="Address"
                        name="address"
                        error={errors.address}
                        className="md:col-span-2"
                    >
                        <textarea
                            id="customer-address"
                            value={data.address}
                            onChange={(event) =>
                                setData(
                                    'address',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                textareaClassName
                            }
                            placeholder="House, road, block and full installation address."
                        />
                    </Field>

                    <Field
                        label="Latitude"
                        name="latitude"
                        error={errors.latitude}
                    >
                        <input
                            id="customer-latitude"
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
                            id="customer-longitude"
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
