import { classNames } from '@/lib/utils';

const tones = {
    success: 'bg-emerald-500',
    info: 'bg-cyan-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    neutral: 'bg-zinc-500',
    teal: 'bg-teal-500',
};

export default function ProgressBar({
    value,
    max = 100,
    tone = 'teal',
    showLabel = false,
    className = '',
}) {
    const percentage = max > 0
        ? Math.min(100, Math.max(0, Math.round((value / max) * 100)))
        : 0;

    return (
        <div className={classNames('w-full', className)}>
            {showLabel && (
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500">
                    <span>Utilization</span>
                    <span>{percentage}%</span>
                </div>
            )}
            <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                    className={classNames(
                        'h-full rounded-full transition-all',
                        tones[tone],
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
