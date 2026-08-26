import Card from '@/Components/UI/Card';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Database, Network, ShieldCheck, Wrench } from 'lucide-react';

const foundationItems = [
    {
        title: 'Route ready',
        description: 'This area is protected by the authenticated dashboard shell.',
        icon: ShieldCheck,
        tone: 'text-teal-700 bg-teal-50 border-teal-100',
    },
    {
        title: 'UI shell ready',
        description: 'The sidebar, top navbar, and active navigation state are connected.',
        icon: Network,
        tone: 'text-cyan-700 bg-cyan-50 border-cyan-100',
    },
    {
        title: 'Data model pending',
        description: 'FTTX tables and CRUD screens will be added in the next implementation phase.',
        icon: Database,
        tone: 'text-amber-700 bg-amber-50 border-amber-100',
    },
];

export default function NetworkSection({ title, eyebrow, description }) {
    return (
        <AuthenticatedLayout title={title} subtitle={description}>
            <Head title={title} />

            <PageHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                {foundationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.title}
                            className="shadow-sm"
                            bodyClassName="p-5"
                        >
                            <div className={`inline-flex rounded-lg border p-2.5 ${item.tone}`}>
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-zinc-950">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                {item.description}
                            </p>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-6">
                <EmptyState
                    icon={Wrench}
                    title={`${title} module is ready for data modeling`}
                    description="This placeholder keeps navigation and layout complete while FTTX tables, workflows, and CRUD screens remain intentionally out of scope for this step."
                />
            </div>
        </AuthenticatedLayout>
    );
}
