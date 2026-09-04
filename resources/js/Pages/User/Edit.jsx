import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    UserCog,
} from 'lucide-react';

export default function Edit({
    user,
    roles,
}) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        password_confirmation: '',
        role: user.role ?? '',
    });

    function submit(event) {
        event.preventDefault();

        put(
            route('users.update', user.id),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AuthenticatedLayout
            title="Edit User"
            subtitle="Update user information and assigned role."
        >
            <Head title={`Edit ${user.name}`} />

            <PageHeader
                eyebrow="Access Control"
                title="Edit User"
                description="Update the staff account, change its role, or reset the account password."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route('users.index'),
                            )
                        }
                    >
                        Back
                    </Button>
                }
            />

            <form onSubmit={submit}>
                <Card
                    className="mt-6"
                    icon={UserCog}
                    title="User Information"
                >
                    <div className="grid gap-5 lg:grid-cols-2">

                        {/* Name */}
                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(event) =>
                                    setData(
                                        'name',
                                        event.target.value,
                                    )
                                }
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="User name"
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData(
                                        'email',
                                        event.target.value,
                                    )
                                }
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="user@example.com"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div className="lg:col-span-2">
                            <label className="text-sm font-semibold text-zinc-700">
                                Role
                            </label>

                            <select
                                value={data.role}
                                onChange={(event) =>
                                    setData(
                                        'role',
                                        event.target.value,
                                    )
                                }
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                            >
                                <option value="">
                                    Select role
                                </option>

                                {roles.map((role) => (
                                    <option
                                        key={role.id}
                                        value={role.name}
                                    >
                                        {role.name
                                            .split('_')
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1),
                                            )
                                            .join(' ')}
                                    </option>
                                ))}
                            </select>

                            {errors.role && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Password */}
                <Card
                    className="mt-6"
                    icon={UserCog}
                    title="Change Password"
                >
                    <p className="mb-5 text-sm text-zinc-500">
                        Leave these fields empty if you do not
                        want to change the user's password.
                    </p>

                    <div className="grid gap-5 lg:grid-cols-2">
                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={data.password}
                                onChange={(event) =>
                                    setData(
                                        'password',
                                        event.target.value,
                                    )
                                }
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="Minimum 8 characters"
                                autoComplete="new-password"
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={
                                    data.password_confirmation
                                }
                                onChange={(event) =>
                                    setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            router.visit(
                                route('users.index'),
                            )
                        }
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
                            : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
