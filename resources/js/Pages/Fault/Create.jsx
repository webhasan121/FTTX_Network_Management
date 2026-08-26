import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import FaultForm from './Partials/FaultForm';

export default function Create({
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
            title="Report Fault"
            subtitle="Create a new FTTX network incident."
        >
            <Head title="Report Fault" />

            <PageHeader
                eyebrow="Network Operations"
                title="Report Network Fault"
                description="Record a network incident and assign the affected infrastructure and responsible operator."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route('faults.index'),
                            )
                        }
                    >
                        Back to Faults
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
                    submitLabel="Report Fault"
                />
            </div>
        </AuthenticatedLayout>
    );
}
