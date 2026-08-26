import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import OltForm from './Partials/OltForm';

export default function Edit({ olt, statuses }) {
    const statusLabel = statuses.find((status) => status.value === olt.status)?.label ?? olt.status;

    return (
        <AuthenticatedLayout
            title={`Edit ${olt.code}`}
            subtitle="Update optical line terminal inventory and operations data."
        >
            <Head title={`Edit ${olt.code}`} />

            <PageHeader
                eyebrow="Optical Line Terminals"
                title={`Edit ${olt.name}`}
                description="Update device identity, management reachability, location coordinates, and status."
                meta={<StatusBadge tone={olt.status}>{statusLabel}</StatusBadge>}
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() => router.visit(route('olts.show', olt.id))}
                    >
                        Back to OLT
                    </Button>
                }
            />

            <div className="mt-6">
                <OltForm olt={olt} statuses={statuses} submitLabel="Save Changes" />
            </div>
        </AuthenticatedLayout>
    );
}
