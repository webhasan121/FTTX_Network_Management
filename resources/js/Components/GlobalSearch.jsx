import { router } from '@inertiajs/react';
import {
    GitBranch,
    LoaderCircle,
    MapPin,
    Network,
    Search,
    Server,
    UserRound,
    Wifi,
    X,
} from 'lucide-react';
import {
    useEffect,
    useRef,
    useState,
} from 'react';

const typeIcons = {
    olt: Server,
    pon: Network,
    splitter: GitBranch,
    distribution: MapPin,
    onu: Wifi,
    customer: UserRound,
};

const typeStyles = {
    olt: 'bg-zinc-100 text-zinc-700',
    pon: 'bg-sky-50 text-sky-700',
    splitter: 'bg-teal-50 text-teal-700',
    distribution: 'bg-violet-50 text-violet-700',
    onu: 'bg-cyan-50 text-cyan-700',
    customer: 'bg-emerald-50 text-emerald-700',
};

const statusStyles = {
    online: 'bg-emerald-50 text-emerald-700',
    active: 'bg-emerald-50 text-emerald-700',

    offline: 'bg-red-50 text-red-700',
    los: 'bg-red-50 text-red-700',

    disabled: 'bg-zinc-100 text-zinc-600',
    inactive: 'bg-zinc-100 text-zinc-600',

    maintenance: 'bg-amber-50 text-amber-700',
};

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Outside click
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
                setActiveIndex(-1);
            }
        }

        document.addEventListener(
            'mousedown',
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        const searchQuery = query.trim();

        if (searchQuery.length < 2) {
            setResults([]);
            setLoading(false);
            setOpen(false);
            setActiveIndex(-1);

            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setOpen(true);

                const response = await fetch(
                    `/global-search?q=${encodeURIComponent(
                        searchQuery
                    )}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },

                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        'Search request failed'
                    );
                }

                const responseData =
                    await response.json();

                setResults(
                    responseData.results ?? []
                );

                setActiveIndex(-1);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error(
                        'Global search error:',
                        error
                    );

                    setResults([]);
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    /*
    |--------------------------------------------------------------------------
    | Open result
    |--------------------------------------------------------------------------
    */
    function openResult(result) {
        setOpen(false);
        setQuery('');
        setResults([]);
        setActiveIndex(-1);

        router.visit(result.url);
    }

    /*
    |--------------------------------------------------------------------------
    | Clear
    |--------------------------------------------------------------------------
    */
    function clearSearch() {
        setQuery('');
        setResults([]);
        setOpen(false);
        setActiveIndex(-1);
    }

    /*
    |--------------------------------------------------------------------------
    | Keyboard Navigation
    |--------------------------------------------------------------------------
    */
    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);

            return;
        }

        if (!open || results.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            setActiveIndex((current) =>
                current >= results.length - 1
                    ? 0
                    : current + 1
            );

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            setActiveIndex((current) =>
                current <= 0
                    ? results.length - 1
                    : current - 1
            );

            return;
        }

        if (
            event.key === 'Enter' &&
            activeIndex >= 0
        ) {
            event.preventDefault();

            openResult(results[activeIndex]);
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full"
        >
            {/* Search Input */}
            <div className="relative">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                />

                <input
                    type="search"
                    value={query}
                    autoComplete="off"
                    placeholder="Search network assets"
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                    onFocus={() => {
                        if (
                            query.trim().length >= 2
                        ) {
                            setOpen(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    className="
                        h-10 w-full rounded-lg
                        border border-zinc-200
                        bg-zinc-50
                        pl-9 pr-9
                        text-sm text-zinc-900
                        outline-none transition
                        placeholder:text-zinc-400
                        focus:border-teal-400
                        focus:bg-white
                        focus:ring-2
                        focus:ring-teal-100
                    "
                />

                {loading ? (
                    <LoaderCircle
                        className="
                            absolute right-3 top-1/2
                            h-4 w-4
                            -translate-y-1/2
                            animate-spin text-zinc-400
                        "
                    />
                ) : query ? (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="
                            absolute right-1.5 top-1/2
                            flex h-7 w-7
                            -translate-y-1/2
                            items-center justify-center
                            rounded-md text-zinc-400
                            transition
                            hover:bg-zinc-100
                            hover:text-zinc-700
                        "
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : null}
            </div>

            {/* Results Dropdown */}
            {open && (
                <div
                    className="
                        fixed left-3 right-3 top-[68px]
                        z-[200]
                        overflow-hidden
                        rounded-xl
                        border border-zinc-200
                        bg-white
                        shadow-2xl

                        md:absolute
                        md:left-auto
                        md:right-0
                        md:top-[calc(100%+10px)]
                        md:w-[440px]
                    "
                >
                    {/* Header */}
                    <div className="border-b border-zinc-100 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    Global Search
                                </p>

                                <p className="mt-1 truncate text-xs text-zinc-400">
                                    Search OLT, PON,
                                    splitter, distribution,
                                    ONU or customer
                                </p>
                            </div>

                            {!loading && (
                                <span
                                    className="
                                        shrink-0 rounded-full
                                        bg-zinc-100
                                        px-2.5 py-1
                                        text-xs font-semibold
                                        text-zinc-600
                                    "
                                >
                                    {results.length} found
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto md:max-h-[420px]">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 px-5 py-10">
                                <LoaderCircle className="h-5 w-5 animate-spin text-teal-600" />

                                <span className="text-sm text-zinc-500">
                                    Searching network...
                                </span>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                {results.map(
                                    (result, index) => {
                                        const Icon =
                                            typeIcons[
                                                result.type
                                            ] ?? Search;

                                        const active =
                                            activeIndex ===
                                            index;

                                        return (
                                            <button
                                                key={
                                                    result.id
                                                }
                                                type="button"
                                                onMouseEnter={() =>
                                                    setActiveIndex(
                                                        index
                                                    )
                                                }
                                                onClick={() =>
                                                    openResult(
                                                        result
                                                    )
                                                }
                                                className={`
                                                    flex w-full
                                                    items-start gap-3
                                                    px-4 py-3
                                                    text-left
                                                    transition
                                                    ${
                                                        active
                                                            ? 'bg-teal-50'
                                                            : 'hover:bg-zinc-50'
                                                    }
                                                `}
                                            >
                                                {/* Icon */}
                                                <div
                                                    className={`
                                                        flex h-10 w-10
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        ${
                                                            typeStyles[
                                                                result
                                                                    .type
                                                            ] ??
                                                            'bg-zinc-100 text-zinc-600'
                                                        }
                                                    `}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                {/* Content */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                                                            {
                                                                result.type_label
                                                            }
                                                        </span>

                                                        {result.status && (
                                                            <span
                                                                className={`
                                                                    rounded-full
                                                                    px-2 py-0.5
                                                                    text-[10px]
                                                                    font-semibold
                                                                    capitalize
                                                                    ${
                                                                        statusStyles[
                                                                            result
                                                                                .status
                                                                        ] ??
                                                                        'bg-zinc-100 text-zinc-600'
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    result.status
                                                                }
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 truncate text-sm font-semibold text-zinc-950">
                                                        {
                                                            result.title
                                                        }
                                                    </p>

                                                    {result.subtitle && (
                                                        <p className="mt-1 truncate text-xs text-zinc-500">
                                                            {
                                                                result.subtitle
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100">
                                    <Search className="h-5 w-5 text-zinc-400" />
                                </div>

                                <p className="mt-3 text-sm font-semibold text-zinc-800">
                                    No assets found
                                </p>

                                <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-zinc-500">
                                    Try an OLT code, PON
                                    name, ONU serial,
                                    customer name or phone
                                    number.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!loading &&
                        results.length > 0 && (
                            <div className="hidden border-t border-zinc-100 bg-zinc-50 px-4 py-2.5 md:block">
                                <p className="text-[11px] text-zinc-400">
                                    ↑ ↓ Navigate • Enter
                                    Open • Esc Close
                                </p>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
