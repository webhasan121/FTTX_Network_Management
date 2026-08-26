import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import DistributionPointForm from './Partials/DistributionPointForm';

export default function Create({
    point,
    splitters,
    types,
}) {
    return (
        <AuthenticatedLayout
            title="Add Distribution Point"
            subtitle="Create a new fiber distribution node."
        >
            <Head title="Add Distribution Point" />

            <PageHeader
                eyebrow="Field Network"
                title="Add Distribution Point"
                description="Register an FDB, FAT, NAP, or ODP and connect it to an upstream splitter."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'distribution-points.index',
                                ),
                            )
                        }
                    >
                        Back to Distribution Points
                    </Button>
                }
            />

            <div className="mt-6">
                <DistributionPointForm
                    point={point}
                    splitters={splitters}
                    types={types}
                    submitLabel="Create Distribution Point"
                />
            </div>
        </AuthenticatedLayout>
    );
}
