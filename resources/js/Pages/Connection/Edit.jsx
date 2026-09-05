import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import usePermission from '@/Hooks/usePermission';
import { ArrowLeft } from 'lucide-react';
import ConnectionForm from './Partials/ConnectionForm';

const statusTone = {
    active: 'online',
    inactive: 'neutral',
    disconnected: 'offline',
};

export default function Edit({
    connection,
    customers,
    onus,
    statuses,
}) {
    const { can } = usePermission();

    return (
        <AuthenticatedLayout
            title={`Edit ${connection.connection_code}`}
            subtitle="Update service connection and ONU assignment."
        >
            <Head
                title={`Edit ${connection.connection_code}`}
            />

            <PageHeader
                eyebrow="Service Provisioning"
                title={`Edit ${connection.connection_code}`}
                description="Update customer assignment, ONU / ONT device, service status, and lifecycle dates."
                meta={
                    <StatusBadge
                        tone={
                            statusTone[
                                connection.status
                            ] ?? 'neutral'
                        }
                    >
                        {connection.status}
                    </StatusBadge>
                }
                actions={
                    can('connection.view') ? (
                        <Button
                            variant="secondary"
                            icon={ArrowLeft}
                            onClick={() =>
                                router.visit(
                                    route(
                                        'connections.show',
                                        connection.id,
                                    ),
                                )
                            }
                        >
                            Back to Connection
                        </Button>
                    ) : null
                }
            />

            <div className="mt-6">
                <ConnectionForm
                    connection={connection}
                    customers={customers}
                    onus={onus}
                    statuses={statuses}
                    submitLabel="Save Changes"
                />
            </div>
        </AuthenticatedLayout>
    );
}
