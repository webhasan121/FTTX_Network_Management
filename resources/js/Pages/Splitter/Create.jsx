import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import SplitterForm from './Partials/SplitterForm';

export default function Create({
    splitter,
    ponPorts,
    ratios,
}) {
    return (
        <AuthenticatedLayout
            title="Add Splitter"
            subtitle="Create a passive optical splitter."
        >
            <Head title="Add Splitter" />

            <PageHeader
                eyebrow="Passive Optical Network"
                title="Add Splitter"
                description="Register a new optical splitter and assign it to an upstream PON port."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() =>
                            router.visit(
                                route(
                                    'splitters.index',
                                ),
                            )
                        }
                    >
                        Back to Splitters
                    </Button>
                }
            />

            <div className="mt-6">
                <SplitterForm
                    splitter={splitter}
                    ponPorts={ponPorts}
                    ratios={ratios}
                    submitLabel="Create Splitter"
                />
            </div>
        </AuthenticatedLayout>
    );
}
