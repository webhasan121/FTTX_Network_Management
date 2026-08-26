import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import SplitterForm from './Partials/SplitterForm';

export default function Edit({
    splitter,
    ponPorts,
    ratios,
}) {
    return (
        <AuthenticatedLayout
            title={`Edit ${splitter.name}`}
            subtitle="Update splitter inventory and topology data."
        >
            <Head
                title={`Edit ${splitter.name}`}
            />

            <PageHeader
                eyebrow="Passive Optical Network"
                title={`Edit ${splitter.name}`}
                description="Update the upstream PON, splitter ratio, port utilization, and field location."
                meta={
                    <>
                        <StatusBadge tone="info">
                            {splitter.ratio}
                        </StatusBadge>

                        <StatusBadge tone="neutral">
                            {splitter.code}
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
                                    'splitters.show',
                                    splitter.id,
                                ),
                            )
                        }
                    >
                        Back to Splitter
                    </Button>
                }
            />

            <div className="mt-6">
                <SplitterForm
                    splitter={splitter}
                    ponPorts={ponPorts}
                    ratios={ratios}
                    submitLabel="Save Changes"
                />
            </div>
        </AuthenticatedLayout>
    );
}
