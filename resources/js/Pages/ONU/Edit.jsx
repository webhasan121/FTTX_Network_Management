import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import OnuForm from './Partials/OnuForm';

const statusTone = {
    online: 'online',
    offline: 'offline',
    los: 'danger',
    disabled: 'neutral',
};

export default function Edit({
    onu,
    statuses,
    distributionPoints,
}) {
    const statusLabel =
        statuses.find(
            (status) =>
                status.value === onu.status,
        )?.label ?? onu.status;

    return (
        <AuthenticatedLayout
            title={`Edit ${onu.serial_number}`}
            subtitle="Update ONU / ONT network and optical data."
        >
            <Head
                title={`Edit ${onu.serial_number}`}
            />

            <PageHeader
                eyebrow="Customer Edge"
                title={`Edit ${onu.serial_number}`}
                description="Update device identity, network assignment, signal information, and operational state."
                meta={
                    <StatusBadge
                        tone={
                            statusTone[
                                onu.status
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
                                    'onu-ont.show',
                                    onu.id,
                                ),
                            )
                        }
                    >
                        Back to ONU
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
                    submitLabel="Save Changes"
                />
            </div>
        </AuthenticatedLayout>
    );
}
