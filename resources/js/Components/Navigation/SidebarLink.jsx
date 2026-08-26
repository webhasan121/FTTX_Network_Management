import { classNames } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function SidebarLink({ item, onNavigate }) {
    const Icon = item.icon;
    const active = route().current(item.route);

    return (
        <Link
            href={route(item.route)}
            onClick={onNavigate}
            className={classNames(
                'group flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
                active
                    ? 'bg-teal-500 text-white shadow-sm shadow-teal-950/20'
                    : 'text-zinc-300 hover:bg-white/10 hover:text-white',
            )}
        >
            <Icon
                className={classNames(
                    'h-5 w-5 shrink-0 transition',
                    active ? 'text-white' : 'text-zinc-500 group-hover:text-teal-200',
                )}
                aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
        </Link>
    );
}
