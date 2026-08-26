import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import CustomerForm from './Partials/CustomerForm';

export default function Create({
    customer,
    statuses,
}) {
    return (
        <AuthenticatedLayout
            title="Add Customer"
            subtitle="Register a new FTTX subscriber."
        >
            <Head title="Add Customer" />

            <PageHeader
                eyebrow="Subscriber Management"
                title="Add Customer"
                description="Register subscriber information before assigning an ONU / ONT connection."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'customers.index',
                                ),
                            )
                        }
                    >
                        Back to Customers
                    </Button>
                }
            />

            <div className="mt-6">
                <CustomerForm
                    customer={customer}
                    statuses={statuses}
                    submitLabel="Create Customer"
                />
            </div>
        </AuthenticatedLayout>
    );
}
