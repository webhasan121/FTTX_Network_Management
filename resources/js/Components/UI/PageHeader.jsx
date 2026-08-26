export default function PageHeader({ eyebrow, title, description, actions, meta }) {
    return (
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-sm font-medium text-teal-700">{eyebrow}</p>
                )}
                <h1 className="mt-2 text-2xl font-semibold text-zinc-950 sm:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
                        {description}
                    </p>
                )}
                {meta && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>
                )}
            </div>

            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
