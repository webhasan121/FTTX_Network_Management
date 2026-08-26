import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ConnectionForm from './Partials/ConnectionForm';

export default function Create({
    connection,
    customers,
    onus,
    statuses,
}) {
    return (
        <AuthenticatedLayout
            title="Add Connection"
            subtitle="Provision a new FTTX subscriber connection."
        >
            <Head title="Add Connection" />

            <PageHeader
                eyebrow="Service Provisioning"
                title="Add Connection"
                description="Assign a customer to an available ONU / ONT and establish the subscriber's FTTX network path."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'connections.index',
                                ),
                            )
                        }
                    >
                        Back to Connections
                    </Button>
                }
            />

            <div className="mt-6">
                <ConnectionForm
                    connection={connection}
                    customers={customers}
                    onus={onus}
                    statuses={statuses}
                    submitLabel="Create Connection"
                />
            </div>
        </AuthenticatedLayout>
    );
}
