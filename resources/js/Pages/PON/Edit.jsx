import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PonPortForm from './Partials/PonPortForm';

const statusTone = {
    active: 'online',
    disabled: 'offline',
};

export default function Edit({
    port,
    olts,
    statuses,
}) {
    const statusLabel =
        statuses.find(
            (status) =>
                status.value === port.status,
        )?.label ?? port.status;

    return (
        <AuthenticatedLayout
            title={`Edit ${port.name}`}
            subtitle="Update PON port inventory and operational data."
        >
            <Head
                title={`Edit ${port.name}`}
            />

            <PageHeader
                eyebrow="Access Layer"
                title={`Edit ${port.name}`}
                description="Update the parent OLT, interface number, capacity, operational status, and notes."
                meta={
                    <StatusBadge
                        tone={
                            statusTone[
                                port.status
                            ] ?? 'neutral'
                        }
                    >
                        {statusLabel}
                    </StatusBadge>
                }
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'pon-ports.show',
                                    port.id,
                                ),
                            )
                        }
                    >
                        Back to PON Port
                    </Button>
                }
            />

            <div className="mt-6">
                <PonPortForm
                    port={port}
                    olts={olts}
                    statuses={statuses}
                    submitLabel="Save Changes"
                />
            </div>
        </AuthenticatedLayout>
    );
}
