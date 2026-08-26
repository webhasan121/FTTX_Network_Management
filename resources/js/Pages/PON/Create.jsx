import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PonPortForm from './Partials/PonPortForm';

export default function Create({
    port,
    olts,
    statuses,
}) {
    return (
        <AuthenticatedLayout
            title="Add PON Port"
            subtitle="Create a new OLT PON interface."
        >
            <Head title="Add PON Port" />

            <PageHeader
                eyebrow="Access Layer"
                title="Add PON Port"
                description="Register a PON interface under an OLT with port number, capacity, and operational status."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'pon-ports.index',
                                ),
                            )
                        }
                    >
                        Back to PON Ports
                    </Button>
                }
            />

            <div className="mt-6">
                <PonPortForm
                    port={port}
                    olts={olts}
                    statuses={statuses}
                    submitLabel="Create PON Port"
                />
            </div>
        </AuthenticatedLayout>
    );
}
