import { classNames } from '@/lib/utils';

const tones = {
    teal: {
        icon: 'border-teal-100 bg-teal-50 text-teal-700',
        accent: 'bg-teal-500',
    },
    cyan: {
        icon: 'border-cyan-100 bg-cyan-50 text-cyan-700',
        accent: 'bg-cyan-500',
    },
    emerald: {
        icon: 'border-emerald-100 bg-emerald-50 text-emerald-700',
        accent: 'bg-emerald-500',
    },
    amber: {
        icon: 'border-amber-100 bg-amber-50 text-amber-700',
        accent: 'bg-amber-500',
    },
    red: {
        icon: 'border-red-100 bg-red-50 text-red-700',
        accent: 'bg-red-500',
    },
    zinc: {
        icon: 'border-zinc-200 bg-zinc-50 text-zinc-700',
        accent: 'bg-zinc-500',
    },
};

export default function StatCard({
    label,
    value,
    detail,
    icon: Icon,
    tone = 'zinc',
}) {
    const selectedTone = tones[tone] ?? tones.zinc;

    return (
        <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className={classNames('absolute inset-x-0 top-0 h-1', selectedTone.accent)} />
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-500">{label}</p>
                    <p className="mt-3 text-3xl font-semibold text-zinc-950">
                        {value}
                    </p>
                </div>
                {Icon && (
                    <div className={classNames('rounded-lg border p-2.5', selectedTone.icon)}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                )}
            </div>
            {detail && <p className="mt-4 text-sm text-zinc-500">{detail}</p>}
        </div>
    );
}
