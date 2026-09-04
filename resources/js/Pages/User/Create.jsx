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

export default function Create({ roles }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    function submit(event) {
        event.preventDefault();

        post(route('users.store'));
    }

    return (
        <AuthenticatedLayout
            title="Create User"
            subtitle="Create a system user and assign a role."
        >
            <Head title="Create User" />

            <PageHeader
                eyebrow="Access Control"
                title="Create User"
                description="Create a staff account and assign its system role."
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
                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                Name
                            </label>

                            <input
                                value={data.name}
                                onChange={(event) =>
                                    setData(
                                        'name',
                                        event.target.value,
                                    )
                                }
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                Password
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
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
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
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>

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
                                className="w-full h-10 mt-2 text-sm rounded-lg shadow-sm border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                            >
                                <option value="">
                                    Select role
                                </option>

                                {roles.map((role) => (
                                    <option
                                        key={role.id}
                                        value={role.name}
                                    >
                                        {role.name}
                                    </option>
                                ))}
                            </select>

                            {errors.role && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

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
                            ? 'Creating...'
                            : 'Create User'}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
