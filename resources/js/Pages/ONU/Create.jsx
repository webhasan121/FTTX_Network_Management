import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import OnuForm from './Partials/OnuForm';

export default function Create({
    onu,
    statuses,
    distributionPoints,
}) {
    return (
        <AuthenticatedLayout
            title="Add ONU / ONT"
            subtitle="Register a customer-edge optical device."
        >
            <Head title="Add ONU / ONT" />

            <PageHeader
                eyebrow="Customer Edge"
                title="Add ONU / ONT"
                description="Register an ONU or ONT and assign it to the appropriate FTTX distribution point."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'onu-ont.index',
                                ),
                            )
                        }
                    >
                        Back to ONU / ONT
                    </Button>
                }
            />

            <div className="mt-6">
                <OnuForm
                    onu={onu}
                    statuses={statuses}
                    distributionPoints={
                        distributionPoints
                    }
                    submitLabel="Create ONU / ONT"
                />
            </div>
        </AuthenticatedLayout>
    );
}
