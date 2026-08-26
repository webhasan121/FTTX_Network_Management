import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const variants = {
    success: { icon: CheckCircle2, classes: 'border-emerald-200 bg-emerald-50 text-emerald-900', iconClasses: 'text-emerald-600' },
    error: { icon: AlertCircle, classes: 'border-red-200 bg-red-50 text-red-900', iconClasses: 'text-red-600' },
    warning: { icon: TriangleAlert, classes: 'border-amber-200 bg-amber-50 text-amber-900', iconClasses: 'text-amber-600' },
    info: { icon: Info, classes: 'border-sky-200 bg-sky-50 text-sky-900', iconClasses: 'text-sky-600' },
};

export function Toast({ type = 'info', message, onClose }) {
    const variant = variants[type] ?? variants.info;
    const Icon = variant.icon;

    useEffect(() => {
        const timeout = window.setTimeout(onClose, 5000);
        return () => window.clearTimeout(timeout);
    }, [onClose]);

    return (
        <div role="alert" className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg ${variant.classes}`}>
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${variant.iconClasses}`} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button type="button" onClick={onClose} className="rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100" aria-label="Dismiss notification">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export function ToastContainer({ flash }) {
    const [toasts, setToasts] = useState([]);
    const [lastFlashKey, setLastFlashKey] = useState(null);

    useEffect(() => {
        const entries = Object.entries(variants)
            .map(([type]) => [type, flash?.[type]])
            .filter(([, message]) => Boolean(message));
        if (entries.length === 0) {
            setLastFlashKey(null);
            return;
        }
        const key = flash.id ?? JSON.stringify(entries);
        if (key === lastFlashKey) return;
        setLastFlashKey(key);
        setToasts((current) => [...current, ...entries.map(([type, message]) => ({ id: `${key}-${type}`, type, message }))]);
    }, [flash, lastFlashKey]);

    const dismiss = (id) => setToasts((current) => current.filter((toast) => toast.id !== id));

    return (
        <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex max-w-md flex-col gap-3 sm:left-auto sm:right-4 sm:inset-x-auto">
            {toasts.map((toast) => <Toast key={toast.id} {...toast} onClose={() => dismiss(toast.id)} />)}
        </div>
    );
}
