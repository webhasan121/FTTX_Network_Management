import { classNames } from '@/lib/utils';

export default function Card({
    title,
    description,
    icon: Icon,
    actions,
    children,
    className = '',
    bodyClassName = '',
}) {
    const hasHeader = title || description || Icon || actions;

    return (
        <section
            className={classNames(
                'rounded-lg border border-zinc-200 bg-white shadow-sm',
                className,
            )}
        >
            {hasHeader && (
                <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4">
                    <div className="flex min-w-0 items-start gap-3">
                        {Icon && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                        )}
                        <div className="min-w-0">
                            {title && (
                                <h2 className="truncate text-base font-semibold text-zinc-950">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="mt-1 text-sm leading-6 text-zinc-500">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {actions && <div className="shrink-0">{actions}</div>}
                </div>
            )}

            <div className={classNames('p-5', bodyClassName)}>{children}</div>
        </section>
    );
}
