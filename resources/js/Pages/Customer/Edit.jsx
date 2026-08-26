import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import CustomerForm from './Partials/CustomerForm';

const statusTone = {
    active: 'online',
    inactive: 'neutral',
};

export default function Edit({
    customer,
    statuses,
}) {
    return (
        <AuthenticatedLayout
            title={`Edit ${customer.name}`}
            subtitle="Update subscriber information."
        >
            <Head
                title={`Edit ${customer.name}`}
            />

            <PageHeader
                eyebrow="Subscriber Management"
                title={`Edit ${customer.name}`}
                description="Update customer identity, contact information, location, and status."
                meta={
                    <>
                        <StatusBadge
                            tone={
                                statusTone[
                                    customer
                                        .status
                                ] ?? 'neutral'
                            }
                        >
                            {customer.status}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {
                                customer.customer_code
                            }
                        </StatusBadge>
                    </>
                }
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'customers.show',
                                    customer.id,
                                ),
                            )
                        }
                    >
                        Back to Customer
                    </Button>
                }
            />

            <div className="mt-6">
                <CustomerForm
                    customer={customer}
                    statuses={statuses}
                    submitLabel="Save Changes"
                />
            </div>
        </AuthenticatedLayout>
    );
}
