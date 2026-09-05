import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import usePermission from '@/Hooks/usePermission';
import { ArrowLeft } from 'lucide-react';
import OltForm from './Partials/OltForm';

export default function Edit({ olt, statuses }) {
    const { can } = usePermission();
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
                    can('olt.view') ? (
                        <Button
                            variant="secondary"
                            icon={ArrowLeft}
                            onClick={() => router.visit(route('olts.show', olt.id))}
                        >
                            Back to OLT
                        </Button>
                    ) : null
                }
            />

            <div className="mt-6">
                <OltForm olt={olt} statuses={statuses} submitLabel="Save Changes" />
            </div>
        </AuthenticatedLayout>
    );
}
