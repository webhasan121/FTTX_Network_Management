import Button from '@/Components/UI/Button';

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}) {
    return (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
            {Icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
            )}
            <h3 className="mt-4 text-base font-semibold text-zinc-950">{title}</h3>
            {description && (
                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                    {description}
                </p>
            )}
            {actionLabel && (
                <Button className="mt-5" variant="secondary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
