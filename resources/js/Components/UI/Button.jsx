import { classNames } from '@/lib/utils';

const variants = {
    primary: 'border-zinc-950 bg-zinc-950 text-white hover:bg-teal-700 hover:border-teal-700 focus:ring-teal-500',
    secondary: 'border-zinc-200 bg-white text-zinc-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 focus:ring-teal-500',
    subtle: 'border-transparent bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950 focus:ring-zinc-400',
    danger: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500',
};

const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
};

export default function Button({
    type = 'button',
    variant = 'secondary',
    size = 'md',
    icon: Icon,
    children,
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            className={classNames(
                'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {children}
        </button>
    );
}
