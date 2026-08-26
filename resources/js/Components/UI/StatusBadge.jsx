import { classNames } from '@/lib/utils';

const tones = {
    online: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    offline: 'border-red-200 bg-red-50 text-red-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    critical: 'border-red-200 bg-red-50 text-red-700',
    maintenance: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    neutral: 'border-zinc-200 bg-zinc-50 text-zinc-700',
    info: 'border-teal-200 bg-teal-50 text-teal-700',
};

export default function StatusBadge({ children, tone = 'neutral', className = '' }) {
    return (
        <span
            className={classNames(
                'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
                tones[tone] ?? tones.neutral,
                className,
            )}
        >
            {children}
        </span>
    );
}
