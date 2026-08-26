import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import FaultForm from './Partials/FaultForm';

const statusTone = {
    open: 'critical',
    in_progress: 'warning',
    resolved: 'online',
};

const severityTone = {
    low: 'neutral',
    medium: 'info',
    high: 'warning',
    critical: 'critical',
};

export default function Edit({
    fault,
    statuses,
    severities,
    faultTypes,
    olts,
    ponPorts,
    distributionPoints,
    onus,
    users,
}) {
    return (
        <AuthenticatedLayout
            title={`Edit ${fault.title}`}
            subtitle="Update incident progress and resolution information."
        >
            <Head title={`Edit ${fault.title}`} />

            <PageHeader
                eyebrow="Network Operations"
                title={`Edit Fault #${fault.id}`}
                description={fault.title}
                meta={
                    <>
                        <StatusBadge
                            tone={
                                severityTone[
                                    fault.severity
                                ] ?? 'neutral'
                            }
                        >
                            {fault.severity}
                        </StatusBadge>

                        <StatusBadge
                            tone={
                                statusTone[
                                    fault.status
                                ] ?? 'neutral'
                            }
                        >
                            {fault.status}
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
                                    'faults.show',
                                    fault.id,
                                ),
                            )
                        }
                    >
                        Back to Fault
                    </Button>
                }
            />

            <div className="mt-6">
                <FaultForm
                    fault={fault}
                    statuses={statuses}
                    severities={severities}
                    faultTypes={faultTypes}
                    olts={olts}
                    ponPorts={ponPorts}
                    distributionPoints={
                        distributionPoints
                    }
                    onus={onus}
                    users={users}
                    submitLabel="Save Changes"
                />
            </div>
        </AuthenticatedLayout>
    );
}
