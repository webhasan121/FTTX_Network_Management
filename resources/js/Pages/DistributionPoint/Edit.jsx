import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import usePermission from '@/Hooks/usePermission';
import { ArrowLeft } from 'lucide-react';
import DistributionPointForm from './Partials/DistributionPointForm';

export default function Edit({
    point,
    splitters,
    types,
}) {
    const { can } = usePermission();

    const typeLabel =
        types.find(
            (type) =>
                type.value === point.type,
        )?.label ?? point.type;

    return (
        <AuthenticatedLayout
            title={`Edit ${point.name}`}
            subtitle="Update distribution node inventory and field data."
        >
            <Head
                title={`Edit ${point.name}`}
            />

            <PageHeader
                eyebrow="Field Network"
                title={`Edit ${point.name}`}
                description="Update upstream splitter, node type, port utilization, and field location."
                meta={
                    <>
                        <StatusBadge tone="info">
                            {typeLabel}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {point.code}
                        </StatusBadge>
                    </>
                }
                actions={
                    can('distribution-point.view') ? (
                        <Button
                            variant="secondary"
                            icon={ArrowLeft}
                            onClick={() =>
                                router.visit(
                                    route(
                                        'distribution-points.show',
                                        point.id,
                                    ),
                                )
                            }
                        >
                            Back to Distribution Point
                        </Button>
                    ) : null
                }
            />

            <div className="mt-6">
                <DistributionPointForm
                    point={point}
                    splitters={splitters}
                    types={types}
                    submitLabel="Save Changes"
                />
            </div>
        </AuthenticatedLayout>
    );
}
