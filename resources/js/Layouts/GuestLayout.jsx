import { Network, ShieldCheck } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-zinc-950 lg:grid lg:grid-cols-[minmax(0,1fr)_480px]">
            <section className="hidden min-h-screen flex-col justify-between p-10 text-white lg:flex">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500">
                        <Network className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                        <div className="text-base font-semibold">FTTX NMS</div>
                        <div className="text-sm text-zinc-400">NOC access console</div>
                    </div>
                </div>

                <div className="max-w-xl">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-teal-200">
                        <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl font-semibold leading-tight">
                        Fiber access operations, ready for the next module.
                    </h1>
                    <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300">
                        Secure operator login for OLTs, PON assets, subscriber links,
                        faults, and topology workflows.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <div className="font-semibold text-white">Role</div>
                        <div className="mt-1 text-zinc-400">Admin seeded</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <div className="font-semibold text-white">Auth</div>
                        <div className="mt-1 text-zinc-400">Login enabled</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <div className="font-semibold text-white">Stack</div>
                        <div className="mt-1 text-zinc-400">Inertia React</div>
                    </div>
                </div>
            </section>

            <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-8 sm:px-6">
                <div className="w-full max-w-md">
                    <div className="mb-6 flex items-center gap-3 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-white">
                            <Network className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-zinc-950">
                                FTTX NMS
                            </div>
                            <div className="text-sm text-zinc-500">NOC access console</div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
