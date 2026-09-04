import SidebarLink from '@/Components/Navigation/SidebarLink';
import { sidebarItems } from '@/Navigation/sidebarItems';
import usePermission from '@/Hooks/usePermission';
import { classNames } from '@/lib/utils';
import {
    Activity,
    Network,
    ShieldCheck,
    X,
} from 'lucide-react';

export default function Sidebar({ open, onClose }) {
    const {
        can,
        isAdmin,
        roles,
    } = usePermission();

    const visibleSidebarItems = sidebarItems.filter(
        (item) => {
            // Permission না থাকলে menu show করবে
            if (!item.permission) {
                return true;
            }

            // Admin অথবা permission থাকলে show করবে
            return can(item.permission);
        },
    );

    const currentRole = roles?.[0]
        ? roles[0]
              .split('_')
              .map(
                  (word) =>
                      word.charAt(0).toUpperCase() +
                      word.slice(1),
              )
              .join(' ')
        : 'No Role';

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={classNames(
                    'fixed inset-0 z-40 bg-zinc-950/60 transition-opacity lg:hidden',
                    open
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0',
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={classNames(
                    'fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col border-r border-white/10 bg-zinc-950 transition duration-200 lg:translate-x-0',
                    open
                        ? 'translate-x-0'
                        : '-translate-x-full',
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-white">
                            <Network
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white">
                                FTTX NMS
                            </div>

                            <div className="truncate text-xs text-zinc-400">
                                Network operations
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <X
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {visibleSidebarItems.map((item) => (
                        <SidebarLink
                            key={item.route}
                            item={item}
                            onNavigate={onClose}
                        />
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-white/10 p-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                            <Activity
                                className="h-4 w-4 text-emerald-300"
                                aria-hidden="true"
                            />

                            System foundation
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                            <ShieldCheck
                                className="h-4 w-4 text-amber-300"
                                aria-hidden="true"
                            />

                            {isAdmin
                                ? 'Admin access enabled'
                                : `${currentRole} access`}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
