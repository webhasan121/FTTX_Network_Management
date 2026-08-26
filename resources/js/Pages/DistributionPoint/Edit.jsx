import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import DistributionPointForm from './Partials/DistributionPointForm';

export default function Edit({
    point,
    splitters,
    types,
}) {
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
