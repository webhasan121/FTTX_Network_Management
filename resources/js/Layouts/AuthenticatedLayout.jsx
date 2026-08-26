import Sidebar from '@/Components/Navigation/Sidebar';
import TopNavbar from '@/Components/Navigation/TopNavbar';
import { ToastContainer } from '@/Components/Toast';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({
    title = 'Dashboard',
    subtitle,
    header,
    children,
}) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-900">
            <ToastContainer flash={flash} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-72">
                <TopNavbar
                    user={user}
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        {header && (
                            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                                {header}
                            </div>
                        )}

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
