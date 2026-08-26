import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import PageHeader from '@/Components/UI/PageHeader';
import StatusBadge from '@/Components/UI/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

import {
    Background,
    Controls,
    Handle,
    MiniMap,
    Position,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import {
    Box,
    Cable,
    CircleDot,
    GitBranch,
    Map,
    Maximize2,
    Radio,
    RefreshCcw,
    Search,
    Server,
    User,
    Wifi,
    X,
} from 'lucide-react';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

/*
|--------------------------------------------------------------------------
| Graph Layout
|--------------------------------------------------------------------------
*/

const LEVEL_X = {
    olt: 0,
    pon: 300,
    splitter: 600,
    distribution: 900,
    onu: 1200,
    customer: 1500,
};

const LEAF_GAP = 115;

/*
|--------------------------------------------------------------------------
| Status Tone
|--------------------------------------------------------------------------
*/

const statusTone = {
    online: 'online',
    active: 'online',

    offline: 'offline',
    disconnected: 'offline',

    los: 'critical',

    maintenance: 'maintenance',

    disabled: 'neutral',
    inactive: 'neutral',
};

/*
|--------------------------------------------------------------------------
| Node Styles
|--------------------------------------------------------------------------
*/

const nodeTypeStyles = {
    olt: {
        wrapper:
            'border-zinc-800 bg-zinc-950 text-white',

        icon:
            'bg-white/10 text-white',

        eyebrow:
            'text-zinc-400',

        subtitle:
            'text-zinc-400',
    },

    pon: {
        wrapper:
            'border-sky-200 bg-sky-50 text-zinc-950',

        icon:
            'bg-sky-100 text-sky-700',

        eyebrow:
            'text-sky-700',

        subtitle:
            'text-zinc-500',
    },

    splitter: {
        wrapper:
            'border-teal-200 bg-teal-50 text-zinc-950',

        icon:
            'bg-teal-100 text-teal-700',

        eyebrow:
            'text-teal-700',

        subtitle:
            'text-zinc-500',
    },

    distribution: {
        wrapper:
            'border-violet-200 bg-violet-50 text-zinc-950',

        icon:
            'bg-violet-100 text-violet-700',

        eyebrow:
            'text-violet-700',

        subtitle:
            'text-zinc-500',
    },

    onu: {
        wrapper:
            'border-zinc-200 bg-white text-zinc-950',

        icon:
            'bg-zinc-100 text-zinc-700',

        eyebrow:
            'text-zinc-500',

        subtitle:
            'text-zinc-500',
    },

    customer: {
        wrapper:
            'border-emerald-200 bg-emerald-50 text-zinc-950',

        icon:
            'bg-emerald-100 text-emerald-700',

        eyebrow:
            'text-emerald-700',

        subtitle:
            'text-zinc-500',
    },
};

/*
|--------------------------------------------------------------------------
| Icons
|--------------------------------------------------------------------------
*/

function getIcon(type) {
    switch (type) {
        case 'olt':
            return Server;

        case 'pon':
            return Cable;

        case 'splitter':
            return GitBranch;

        case 'distribution':
            return Box;

        case 'onu':
            return Radio;

        case 'customer':
            return User;

        default:
            return CircleDot;
    }
}

/*
|--------------------------------------------------------------------------
| Details Route
|--------------------------------------------------------------------------
*/

function routeForNode(data) {
    if (!data?.entityId) {
        return null;
    }

    switch (data.entityType) {
        case 'olt':
            return route(
                'olts.show',
                data.entityId,
            );

        case 'pon':
            return route(
                'pon-ports.show',
                data.entityId,
            );

        case 'splitter':
            return route(
                'splitters.show',
                data.entityId,
            );

        case 'distribution':
            return route(
                'distribution-points.show',
                data.entityId,
            );

        case 'onu':
            return route(
                'onu-ont.show',
                data.entityId,
            );

        case 'customer':
            return route(
                'customers.show',
                data.entityId,
            );

        default:
            return null;
    }
}

/*
|--------------------------------------------------------------------------
| Custom Topology Node
|--------------------------------------------------------------------------
*/

function TopologyNode({
    data,
    selected,
}) {
    const Icon = getIcon(
        data.entityType,
    );

    const styles =
        nodeTypeStyles[
            data.entityType
        ] ?? nodeTypeStyles.onu;

    return (
        <div
            className={[
                'w-[230px] rounded-xl border shadow-sm transition-all duration-200',

                styles.wrapper,

                selected
                    ? 'ring-2 ring-teal-500 ring-offset-2'
                    : '',

                data.dimmed
                    ? 'opacity-20'
                    : 'opacity-100',

                data.highlighted
                    ? 'ring-2 ring-amber-400 ring-offset-2'
                    : '',
            ].join(' ')}
        >
            {data.entityType !==
                'olt' && (
                <Handle
                    type="target"
                    position={
                        Position.Left
                    }
                    className="!h-3 !w-3 !border-2 !border-white !bg-zinc-400"
                />
            )}

            <div className="p-3">
                <div className="flex items-start gap-3">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
                    >
                        <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p
                            className={`text-[10px] font-bold uppercase tracking-[0.12em] ${styles.eyebrow}`}
                        >
                            {
                                data.typeLabel
                            }
                        </p>

                        <p className="mt-1 text-sm font-bold truncate">
                            {data.title}
                        </p>

                        {data.subtitle && (
                            <p
                                className={`mt-1 truncate text-xs ${styles.subtitle}`}
                            >
                                {
                                    data.subtitle
                                }
                            </p>
                        )}
                    </div>
                </div>

                {(data.status ||
                    data.meta) && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {data.status && (
                            <StatusBadge
                                tone={
                                    statusTone[
                                        data.status
                                    ] ??
                                    'neutral'
                                }
                            >
                                {
                                    data.status
                                }
                            </StatusBadge>
                        )}

                        {data.meta && (
                            <span
                                className={[
                                    'rounded-md px-2 py-1 text-[11px] font-semibold',

                                    data.entityType ===
                                    'olt'
                                        ? 'bg-white/10 text-zinc-200'
                                        : 'bg-white/80 text-zinc-600',
                                ].join(
                                    ' ',
                                )}
                            >
                                {
                                    data.meta
                                }
                            </span>
                        )}
                    </div>
                )}
            </div>

            {data.entityType !==
                'customer' && (
                <Handle
                    type="source"
                    position={
                        Position.Right
                    }
                    className="!h-3 !w-3 !border-2 !border-white !bg-teal-600"
                />
            )}
        </div>
    );
}

const nodeTypes = {
    topology: TopologyNode,
};

/*
|--------------------------------------------------------------------------
| Build React Flow Graph
|--------------------------------------------------------------------------
*/

function buildGraph(
    network,
    showCustomers = true,
) {
    const nodes = [];
    const edges = [];

    let leafIndex = 0;

    function addEdge(
        parentId,
        childId,
        animated = false,
    ) {
        if (!parentId) {
            return;
        }

        edges.push({
            id: `edge-${parentId}-${childId}`,

            source: parentId,

            target: childId,

            type: 'smoothstep',

            animated,

            style: {
                stroke: animated
                    ? '#0f766e'
                    : '#a1a1aa',

                strokeWidth: animated
                    ? 2
                    : 1.5,
            },
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Customer Node
    |--------------------------------------------------------------------------
    */

    function customerNode(
        customer,
        parentId,
        path,
    ) {
        const id =
            `customer-${customer.id}`;

        const y =
            leafIndex *
            LEAF_GAP;

        leafIndex += 1;

        nodes.push({
            id,

            type: 'topology',

            position: {
                x: LEVEL_X.customer,
                y,
            },

            data: {
                entityId:
                    customer.id,

                entityType:
                    'customer',

                typeLabel:
                    'Customer',

                title:
                    customer.name,

                subtitle:
                    customer.customer_code,

                meta:
                    customer.area ||
                    null,

                status:
                    'active',

                path: [
                    ...path,
                    customer.name,
                ],
            },
        });

        addEdge(
            parentId,
            id,
            true,
        );

        return y;
    }

    /*
    |--------------------------------------------------------------------------
    | ONU Node
    |--------------------------------------------------------------------------
    */

    function onuNode(
        onu,
        parentId,
        path,
    ) {
        const id =
            `onu-${onu.id}`;

        let y;

        if (
            showCustomers &&
            onu.customer
        ) {
            y =
                customerNode(
                    onu.customer,
                    id,
                    [
                        ...path,
                        onu.serial_number,
                    ],
                );
        } else {
            y =
                leafIndex *
                LEAF_GAP;

            leafIndex += 1;
        }

        nodes.push({
            id,

            type: 'topology',

            position: {
                x: LEVEL_X.onu,
                y,
            },

            data: {
                entityId:
                    onu.id,

                entityType:
                    'onu',

                typeLabel:
                    'ONU / ONT',

                title:
                    onu.serial_number,

                subtitle: [
                    onu.vendor,
                    onu.model,
                ]
                    .filter(Boolean)
                    .join(' • '),

                status:
                    onu.status,

                meta:
                    onu.rx_power !==
                        null &&
                    onu.rx_power !==
                        undefined
                        ? `Rx ${onu.rx_power} dBm`
                        : null,

                path: [
                    ...path,
                    onu.serial_number,
                ],
            },
        });

        addEdge(
            parentId,
            id,
            onu.status ===
                'online',
        );

        return y;
    }

    /*
    |--------------------------------------------------------------------------
    | Distribution Point Node
    |--------------------------------------------------------------------------
    */

    function distributionNode(
        point,
        parentId,
        path,
    ) {
        const id =
            `distribution-${point.id}`;

        const childYs = [];

        point.onus?.forEach(
            (onu) => {
                childYs.push(
                    onuNode(
                        onu,
                        id,
                        [
                            ...path,
                            point.code,
                        ],
                    ),
                );
            },
        );

        let y;

        if (childYs.length) {
            y =
                (Math.min(
                    ...childYs,
                ) +
                    Math.max(
                        ...childYs,
                    )) /
                2;
        } else {
            y =
                leafIndex *
                LEAF_GAP;

            leafIndex += 1;
        }

        nodes.push({
            id,

            type: 'topology',

            position: {
                x: LEVEL_X.distribution,
                y,
            },

            data: {
                entityId:
                    point.id,

                entityType:
                    'distribution',

                typeLabel:
                    String(
                        point.type,
                    ).toUpperCase(),

                title:
                    point.code,

                subtitle:
                    point.name,

                meta:
                    `${point.used_ports}/${point.total_ports} ports`,

                path: [
                    ...path,
                    point.code,
                ],
            },
        });

        addEdge(
            parentId,
            id,
        );

        return y;
    }

    /*
    |--------------------------------------------------------------------------
    | Splitter Node
    |--------------------------------------------------------------------------
    */

    function splitterNode(
        splitter,
        parentId,
        path,
    ) {
        const id =
            `splitter-${splitter.id}`;

        const childYs = [];

        splitter.distribution_points?.forEach(
            (point) => {
                childYs.push(
                    distributionNode(
                        point,
                        id,
                        [
                            ...path,
                            splitter.code,
                        ],
                    ),
                );
            },
        );

        let y;

        if (childYs.length) {
            y =
                (Math.min(
                    ...childYs,
                ) +
                    Math.max(
                        ...childYs,
                    )) /
                2;
        } else {
            y =
                leafIndex *
                LEAF_GAP;

            leafIndex += 1;
        }

        nodes.push({
            id,

            type: 'topology',

            position: {
                x: LEVEL_X.splitter,
                y,
            },

            data: {
                entityId:
                    splitter.id,

                entityType:
                    'splitter',

                typeLabel:
                    'Splitter',

                title:
                    splitter.code,

                subtitle:
                    splitter.name,

                meta:
                    `${splitter.ratio} • ${splitter.used_ports}/${splitter.total_ports}`,

                path: [
                    ...path,
                    splitter.code,
                ],
            },
        });

        addEdge(
            parentId,
            id,
        );

        return y;
    }

    /*
    |--------------------------------------------------------------------------
    | PON Node
    |--------------------------------------------------------------------------
    */

    function ponNode(
        pon,
        parentId,
        path,
    ) {
        const id =
            `pon-${pon.id}`;

        const childYs = [];

        pon.splitters?.forEach(
            (splitter) => {
                childYs.push(
                    splitterNode(
                        splitter,
                        id,
                        [
                            ...path,
                            pon.name,
                        ],
                    ),
                );
            },
        );

        let y;

        if (childYs.length) {
            y =
                (Math.min(
                    ...childYs,
                ) +
                    Math.max(
                        ...childYs,
                    )) /
                2;
        } else {
            y =
                leafIndex *
                LEAF_GAP;

            leafIndex += 1;
        }

        nodes.push({
            id,

            type: 'topology',

            position: {
                x: LEVEL_X.pon,
                y,
            },

            data: {
                entityId:
                    pon.id,

                entityType:
                    'pon',

                typeLabel:
                    'PON Port',

                title:
                    pon.name,

                subtitle:
                    `Port #${pon.port_number}`,

                status:
                    pon.status,

                meta:
                    `Capacity ${pon.capacity}`,

                path: [
                    ...path,
                    pon.name,
                ],
            },
        });

        addEdge(
            parentId,
            id,
        );

        return y;
    }

    /*
    |--------------------------------------------------------------------------
    | OLT Node
    |--------------------------------------------------------------------------
    */

    network.forEach(
        (olt) => {
            const id =
                `olt-${olt.id}`;

            const childYs = [];

            olt.pon_ports?.forEach(
                (pon) => {
                    childYs.push(
                        ponNode(
                            pon,
                            id,
                            [
                                olt.code,
                            ],
                        ),
                    );
                },
            );

            let y;

            if (
                childYs.length
            ) {
                y =
                    (Math.min(
                        ...childYs,
                    ) +
                        Math.max(
                            ...childYs,
                        )) /
                    2;
            } else {
                y =
                    leafIndex *
                    LEAF_GAP;

                leafIndex += 1;
            }

            nodes.push({
                id,

                type: 'topology',

                position: {
                    x: LEVEL_X.olt,
                    y,
                },

                data: {
                    entityId:
                        olt.id,

                    entityType:
                        'olt',

                    typeLabel:
                        'OLT',

                    title:
                        olt.code,

                    subtitle:
                        olt.name,

                    status:
                        olt.status,

                    meta:
                        olt.location_name ||
                        olt.ip_address,

                    path: [
                        olt.code,
                    ],
                },
            });
        },
    );

    return {
        nodes,
        edges,
    };
}

/*
|--------------------------------------------------------------------------
| Summary Item
|--------------------------------------------------------------------------
*/

function SummaryItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center min-w-0 gap-3 px-4 py-3 bg-white border shadow-sm rounded-xl border-zinc-200">
            <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-zinc-100 text-zinc-600">
                <Icon className="w-4 h-4" />
            </div>

            <div>
                <p className="text-xs font-medium text-zinc-500">
                    {label}
                </p>

                <p className="text-xl font-semibold text-zinc-950">
                    {value ?? 0}
                </p>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Node Details Panel
|--------------------------------------------------------------------------
*/

function NodeDetails({
    node,
    onClose,
}) {
    if (!node) {
        return (
            <div className="flex min-h-[320px] items-center justify-center px-6 text-center">
                <div>
                    <Map className="w-10 h-10 mx-auto text-zinc-300" />

                    <p className="mt-4 text-sm font-semibold text-zinc-700">
                        Select a network node
                    </p>

                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                        Click any OLT,
                        PON port,
                        splitter,
                        distribution point,
                        ONU / ONT or
                        customer to inspect
                        its information.
                    </p>
                </div>
            </div>
        );
    }

    const data =
        node.data;

    const Icon =
        getIcon(
            data.entityType,
        );

    const detailsUrl =
        routeForNode(data);

    return (
        <div>
            <div className="flex items-start justify-between p-5 border-b border-zinc-200">
                <div className="flex items-center min-w-0 gap-3">
                    <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-zinc-100">
                        <Icon className="w-5 h-5 text-zinc-700" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-wide uppercase text-zinc-400">
                            {
                                data.typeLabel
                            }
                        </p>

                        <p className="mt-1 text-base font-semibold truncate text-zinc-950">
                            {
                                data.title
                            }
                        </p>

                        {data.subtitle && (
                            <p className="mt-1 text-xs text-zinc-500">
                                {
                                    data.subtitle
                                }
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center transition rounded-lg h-9 w-9 shrink-0 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5 space-y-5">
                {data.status && (
                    <div>
                        <p className="text-xs font-semibold uppercase text-zinc-400">
                            Status
                        </p>

                        <div className="mt-2">
                            <StatusBadge
                                tone={
                                    statusTone[
                                        data.status
                                    ] ??
                                    'neutral'
                                }
                            >
                                {
                                    data.status
                                }
                            </StatusBadge>
                        </div>
                    </div>
                )}

                {data.meta && (
                    <div>
                        <p className="text-xs font-semibold uppercase text-zinc-400">
                            Information
                        </p>

                        <p className="mt-2 text-sm font-medium text-zinc-800">
                            {
                                data.meta
                            }
                        </p>
                    </div>
                )}

                <div>
                    <p className="text-xs font-semibold uppercase text-zinc-400">
                        Network Path
                    </p>

                    <div className="mt-3 space-y-2">
                        {data.path?.map(
                            (
                                item,
                                index,
                            ) => (
                                <div
                                    key={`${item}-${index}`}
                                    className="flex items-center gap-2"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-500">
                                        {index +
                                            1}
                                    </span>

                                    <span className="text-sm font-medium text-zinc-700">
                                        {item}
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {detailsUrl && (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() =>
                            router.visit(
                                detailsUrl,
                            )
                        }
                    >
                        View Full Details
                    </Button>
                )}
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Legend
|--------------------------------------------------------------------------
*/

function Legend({
    icon: Icon,
    label,
}) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg border-zinc-200">
            <Icon className="w-4 h-4 text-zinc-500" />

            <span className="text-sm font-medium text-zinc-700">
                {label}
            </span>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

export default function Index({
    network,
    summary,
    filters,
    oltOptions,
}) {
    const [oltId, setOltId] =
        useState(
            filters?.olt_id ?? '',
        );

    const [
        showCustomers,
        setShowCustomers,
    ] = useState(true);

    const [search, setSearch] =
        useState('');

    const [
        selectedNode,
        setSelectedNode,
    ] = useState(null);

    const [
        flowInstance,
        setFlowInstance,
    ] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Generate Graph
    |--------------------------------------------------------------------------
    */

    const graph = useMemo(
        () =>
            buildGraph(
                network ?? [],
                showCustomers,
            ),

        [
            network,
            showCustomers,
        ],
    );

    const [
        nodes,
        setNodes,
        onNodesChange,
    ] = useNodesState(
        graph.nodes,
    );

    const [
        edges,
        setEdges,
        onEdgesChange,
    ] = useEdgesState(
        graph.edges,
    );

    /*
    |--------------------------------------------------------------------------
    | Reload Graph
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setNodes(
            graph.nodes,
        );

        setEdges(
            graph.edges,
        );

        setSelectedNode(
            null,
        );

        const timer =
            window.setTimeout(
                () => {
                    flowInstance?.fitView(
                        {
                            padding:
                                0.12,

                            duration:
                                500,
                        },
                    );
                },
                150,
            );

        return () => {
            window.clearTimeout(
                timer,
            );
        };
    }, [
        graph,
        flowInstance,
        setNodes,
        setEdges,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Node Search
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const term =
            search
                .trim()
                .toLowerCase();

        setNodes(
            graph.nodes.map(
                (node) => {
                    if (!term) {
                        return {
                            ...node,

                            data: {
                                ...node.data,

                                dimmed:
                                    false,

                                highlighted:
                                    false,
                            },
                        };
                    }

                    const searchable =
                        [
                            node.data
                                .title,

                            node.data
                                .subtitle,

                            node.data
                                .meta,

                            node.data
                                .status,

                            node.data
                                .typeLabel,
                        ]
                            .filter(
                                Boolean,
                            )
                            .join(' ')
                            .toLowerCase();

                    const match =
                        searchable.includes(
                            term,
                        );

                    return {
                        ...node,

                        data: {
                            ...node.data,

                            dimmed:
                                !match,

                            highlighted:
                                match,
                        },
                    };
                },
            ),
        );
    }, [
        search,
        graph.nodes,
        setNodes,
    ]);

    /*
    |--------------------------------------------------------------------------
    | OLT Filter
    |--------------------------------------------------------------------------
    */

    function changeOlt(
        value,
    ) {
        setOltId(value);

        setSelectedNode(
            null,
        );

        router.get(
            route(
                'network-map.index',
            ),

            value
                ? {
                      olt_id:
                          value,
                  }
                : {},

            {
                preserveState:
                    true,

                preserveScroll:
                    true,

                replace:
                    true,
            },
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    function resetFilters() {
        setOltId('');

        setSearch('');

        setSelectedNode(
            null,
        );

        setShowCustomers(
            true,
        );

        router.get(
            route(
                'network-map.index',
            ),
            {},
            {
                preserveState:
                    true,

                preserveScroll:
                    true,

                replace:
                    true,
            },
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Fit Graph
    |--------------------------------------------------------------------------
    */

    function fitGraph() {
        flowInstance?.fitView({
            padding: 0.12,

            duration: 500,
        });
    }

    return (
        <AuthenticatedLayout
            title="Network Map"
            subtitle="Interactive FTTX topology visualization."
        >
            <Head title="Network Map" />

            <PageHeader
                eyebrow="Network Topology"
                title="Interactive FTTX Topology"
                description="Explore the complete logical network from OLT to subscriber using an interactive topology graph."
                meta={
                    <StatusBadge tone="info">
                        Interactive Graph
                    </StatusBadge>
                }
            />

            {/* Summary Cards */}
            <div className="grid gap-3 mt-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                <SummaryItem
                    icon={Server}
                    label="OLT"
                    value={
                        summary?.olts
                    }
                />

                <SummaryItem
                    icon={Cable}
                    label="PON Ports"
                    value={
                        summary?.pon_ports
                    }
                />

                <SummaryItem
                    icon={
                        GitBranch
                    }
                    label="Splitters"
                    value={
                        summary?.splitters
                    }
                />

                <SummaryItem
                    icon={Box}
                    label="Distribution"
                    value={
                        summary?.distribution_points
                    }
                />

                <SummaryItem
                    icon={Radio}
                    label="ONU / ONT"
                    value={
                        summary?.onus
                    }
                />
            </div>

            {/* ONU Status Summary */}
            <div className="flex flex-wrap gap-3 mt-3">
                <StatusBadge tone="online">
                    Online ONU:{' '}
                    {summary?.online_onus ??
                        0}
                </StatusBadge>

                <StatusBadge tone="offline">
                    Offline ONU:{' '}
                    {summary?.offline_onus ??
                        0}
                </StatusBadge>

                <StatusBadge tone="critical">
                    LOS ONU:{' '}
                    {summary?.los_onus ??
                        0}
                </StatusBadge>
            </div>

            {/* Controls */}
            <Card
                className="mt-6"
                title="Topology Controls"
                description="Filter, search, and navigate the interactive FTTX network."
                icon={Map}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {/* OLT */}
                    <select
                        value={oltId}
                        onChange={(
                            event,
                        ) =>
                            changeOlt(
                                event
                                    .target
                                    .value,
                            )
                        }
                        className="h-10 min-w-[240px] flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:w-[320px] sm:flex-none"
                    >
                        <option value="">
                            All OLTs
                        </option>

                        {(oltOptions ??
                            []).map(
                            (olt) => (
                                <option
                                    key={
                                        olt.id
                                    }
                                    value={
                                        olt.id
                                    }
                                >
                                    {
                                        olt.code
                                    }{' '}
                                    -{' '}
                                    {
                                        olt.name
                                    }
                                </option>
                            ),
                        )}
                    </select>

                    {/* Search */}
                    <div className="relative min-w-[220px] flex-1">
                        <Search className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />

                        <input
                            type="search"
                            value={
                                search
                            }
                            onChange={(
                                event,
                            ) =>
                                setSearch(
                                    event
                                        .target
                                        .value,
                                )
                            }
                            placeholder="Search node..."
                            className="w-full h-10 pr-3 text-sm bg-white border rounded-lg shadow-sm border-zinc-300 pl-9 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                        />
                    </div>

                    {/* Customer Toggle */}
                    <label className="flex items-center h-10 gap-2 px-3 text-sm font-medium bg-white border rounded-lg cursor-pointer border-zinc-300 text-zinc-700">
                        <input
                            type="checkbox"
                            checked={
                                showCustomers
                            }
                            onChange={(
                                event,
                            ) =>
                                setShowCustomers(
                                    event
                                        .target
                                        .checked,
                                )
                            }
                            className="text-teal-600 rounded border-zinc-300 focus:ring-teal-500"
                        />

                        Show Customers
                    </label>

                    {/* Fit */}
                    <Button
                        type="button"
                        variant="secondary"
                        icon={
                            Maximize2
                        }
                        onClick={
                            fitGraph
                        }
                    >
                        Fit View
                    </Button>

                    {/* Reset */}
                    <Button
                        type="button"
                        variant="secondary"
                        icon={
                            RefreshCcw
                        }
                        onClick={
                            resetFilters
                        }
                    >
                        Reset
                    </Button>
                </div>
            </Card>

            {/* Graph + Details */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                {/* Graph */}
                <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-zinc-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-200">
                        <div>
                            <p className="text-sm font-semibold text-zinc-950">
                                Logical
                                Network
                                Topology
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                                Drag
                                nodes,
                                pan,
                                zoom and
                                click a
                                node for
                                more
                                information.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                            <span>
                                {
                                    nodes.length
                                }{' '}
                                nodes
                            </span>

                            <span>
                                •
                            </span>

                            <span>
                                {
                                    edges.length
                                }{' '}
                                links
                            </span>
                        </div>
                    </div>

                    <div className="h-[680px] w-full">
                        <ReactFlow
                            nodes={
                                nodes
                            }
                            edges={
                                edges
                            }
                            nodeTypes={
                                nodeTypes
                            }
                            onNodesChange={
                                onNodesChange
                            }
                            onEdgesChange={
                                onEdgesChange
                            }
                            onInit={
                                setFlowInstance
                            }
                            onNodeClick={(
                                _event,
                                node,
                            ) => {
                                setSelectedNode(
                                    node,
                                );
                            }}
                            onPaneClick={() => {
                                setSelectedNode(
                                    null,
                                );
                            }}
                            fitView
                            fitViewOptions={{
                                padding:
                                    0.12,
                            }}
                            minZoom={
                                0.08
                            }
                            maxZoom={2}
                            nodesDraggable
                            nodesConnectable={
                                false
                            }
                            elementsSelectable
                            panOnDrag
                            zoomOnScroll
                            zoomOnPinch
                            zoomOnDoubleClick
                            proOptions={{
                                hideAttribution:
                                    true,
                            }}
                        >
                            <Background
                                gap={22}
                                size={1}
                                color="#e4e4e7"
                            />

                            <Controls />

                            <MiniMap
                                pannable
                                zoomable
                                nodeStrokeWidth={
                                    3
                                }
                            />
                        </ReactFlow>
                    </div>
                </div>

                {/* Details Panel */}
                <div className="self-start overflow-hidden bg-white border shadow-sm rounded-2xl border-zinc-200 xl:sticky xl:top-6">
                    <NodeDetails
                        node={
                            selectedNode
                        }
                        onClose={() =>
                            setSelectedNode(
                                null,
                            )
                        }
                    />
                </div>
            </div>

            {/* Legend */}
            <Card
                className="mt-6"
                title="Topology Legend"
                description="Node types used in the logical FTTX network."
            >
                <div className="flex flex-wrap gap-3">
                    <Legend
                        icon={Server}
                        label="OLT"
                    />

                    <Legend
                        icon={Cable}
                        label="PON Port"
                    />

                    <Legend
                        icon={
                            GitBranch
                        }
                        label="Splitter"
                    />

                    <Legend
                        icon={Box}
                        label="Distribution Point"
                    />

                    <Legend
                        icon={Radio}
                        label="ONU / ONT"
                    />

                    <Legend
                        icon={User}
                        label="Customer"
                    />
                </div>

                <div className="px-4 py-3 mt-5 border border-teal-100 rounded-xl bg-teal-50">
                    <p className="text-sm font-semibold text-teal-800">
                        OLT → PON Port →
                        Splitter →
                        Distribution Point
                        → ONU / ONT →
                        Customer
                    </p>
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
