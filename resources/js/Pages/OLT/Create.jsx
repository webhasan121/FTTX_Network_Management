import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import OltForm from './Partials/OltForm';

export default function Create({ olt, statuses }) {
    return (
        <AuthenticatedLayout
            title="Add OLT"
            subtitle="Create a new optical line terminal record."
        >
            <Head title="Add OLT" />

            <PageHeader
                eyebrow="Optical Line Terminals"
                title="Add OLT"
                description="Register a managed access node with device identity, management IP, POP location, and operational status."
                actions={
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() => router.visit(route('olts.index'))}
                    >
                        Back to OLTs
                    </Button>
                }
            />

            <div className="mt-6">
                <OltForm olt={olt} statuses={statuses} submitLabel="Create OLT" />
            </div>
        </AuthenticatedLayout>
    );
}
