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
    Crosshair,
    GitBranch,
    Map as MapIcon,
    Maximize2,
    Network,
    Radio,
    RefreshCcw,
    Search,
    Server,
    User,
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
    pon: 320,
    splitter: 640,
    distribution: 960,
    onu: 1280,
    customer: 1600,
};

const LEAF_GAP = 125;

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
| Icon Helper
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
| Custom Node
|--------------------------------------------------------------------------
*/

function TopologyNode({
    data,
    selected,
}) {
    const Icon =
        getIcon(
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
            {data.entityType !== 'olt' && (
                <Handle
                    type="target"
                    position={Position.Left}
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
                            {data.typeLabel}
                        </p>

                        <p className="mt-1 text-sm font-bold truncate">
                            {data.title}
                        </p>

                        {data.subtitle && (
                            <p
                                className={`mt-1 truncate text-xs ${styles.subtitle}`}
                            >
                                {data.subtitle}
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
                                {data.status}
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
                                ].join(' ')}
                            >
                                {data.meta}
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
| Calculate Summary
|--------------------------------------------------------------------------
*/

function calculateSummary(network) {
    const result = {
        olts: 0,
        pon_ports: 0,
        splitters: 0,
        distribution_points: 0,
        onus: 0,
        online_onus: 0,
        offline_onus: 0,
        los_onus: 0,
    };

    (network ?? []).forEach(
        (olt) => {
            result.olts += 1;

            (olt.pon_ports ?? []).forEach(
                (pon) => {
                    result.pon_ports += 1;

                    (
                        pon.splitters ?? []
                    ).forEach(
                        (splitter) => {
                            result.splitters += 1;

                            (
                                splitter.distribution_points ??
                                []
                            ).forEach(
                                (point) => {
                                    result.distribution_points +=
                                        1;

                                    (
                                        point.onus ??
                                        []
                                    ).forEach(
                                        (onu) => {
                                            result.onus +=
                                                1;

                                            if (
                                                onu.status ===
                                                'online'
                                            ) {
                                                result.online_onus +=
                                                    1;
                                            }

                                            if (
                                                onu.status ===
                                                'offline'
                                            ) {
                                                result.offline_onus +=
                                                    1;
                                            }

                                            if (
                                                onu.status ===
                                                'los'
                                            ) {
                                                result.los_onus +=
                                                    1;
                                            }
                                        },
                                    );
                                },
                            );
                        },
                    );
                },
            );
        },
    );

    return result;
}

/*
|--------------------------------------------------------------------------
| Build Graph
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
    ) {
        if (!parentId) {
            return;
        }

        edges.push({
            id: `edge-${parentId}-${childId}`,

            source: parentId,

            target: childId,

            type: 'smoothstep',
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Customer
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

                parentGraphId:
                    parentId,

                path: [
                    ...path,
                    customer.name,
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
    | ONU
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

                parentGraphId:
                    parentId,

                path: [
                    ...path,
                    onu.serial_number,
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
    | Distribution Point
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

        (
            point.onus ?? []
        ).forEach(
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
                x:
                    LEVEL_X.distribution,
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

                parentGraphId:
                    parentId,

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
    | Splitter
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

        (
            splitter.distribution_points ??
            []
        ).forEach(
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

                parentGraphId:
                    parentId,

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
    | PON
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

        (
            pon.splitters ?? []
        ).forEach(
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

                parentGraphId:
                    parentId,

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
    | OLT
    |--------------------------------------------------------------------------
    */

    (network ?? []).forEach(
        (olt) => {
            const id =
                `olt-${olt.id}`;

            const childYs = [];

            (
                olt.pon_ports ?? []
            ).forEach(
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

                    parentGraphId:
                        null,

                    path: [
                        olt.code,
                    ],
                },
            });
        },
    );

    /*
    |--------------------------------------------------------------------------
    | Connection Health
    |--------------------------------------------------------------------------
    |
    | Every healthy path is animated. If the current node or any upstream
    | parent is Offline / LOS, that branch becomes static.
    |
    */

    const graphNodeMap =
        new Map(
            nodes.map(
                (node) => [
                    node.id,
                    node,
                ],
            ),
        );

    const resolvedStatusCache =
        new Map();

    function normalizedConnectionStatus(
        status,
    ) {
        const value =
            String(
                status ??
                    'online',
            )
                .trim()
                .toLowerCase();

        if (
            value === 'los' ||
            value ===
                'loss_of_signal'
        ) {
            return 'los';
        }

        if (
            [
                'offline',
                'disconnected',
                'inactive',
                'disabled',
                'down',
            ].includes(value)
        ) {
            return 'offline';
        }

        return 'online';
    }

    function resolvePathStatus(
        graphNodeId,
        visited = new Set(),
    ) {
        if (
            resolvedStatusCache.has(
                graphNodeId,
            )
        ) {
            return resolvedStatusCache.get(
                graphNodeId,
            );
        }

        if (visited.has(graphNodeId)) {
            return 'online';
        }

        visited.add(graphNodeId);

        const node =
            graphNodeMap.get(
                graphNodeId,
            );

        if (!node) {
            return 'online';
        }

        const ownStatus =
            normalizedConnectionStatus(
                node.data?.status,
            );

        if (ownStatus === 'los') {
            resolvedStatusCache.set(
                graphNodeId,
                'los',
            );

            return 'los';
        }

        const parentId =
            node.data?.parentGraphId;

        if (!parentId) {
            resolvedStatusCache.set(
                graphNodeId,
                ownStatus,
            );

            return ownStatus;
        }

        const parentStatus =
            resolvePathStatus(
                parentId,
                visited,
            );

        let result =
            ownStatus;

        if (parentStatus === 'los') {
            result = 'los';
        } else if (
            ownStatus === 'offline' ||
            parentStatus === 'offline'
        ) {
            result = 'offline';
        } else {
            result = 'online';
        }

        resolvedStatusCache.set(
            graphNodeId,
            result,
        );

        return result;
    }

    edges.forEach(
        (edge) => {
            edge.data = {
                ...edge.data,

                connectionStatus:
                    resolvePathStatus(
                        edge.target,
                    ),
            };
        },
    );

    return {
        nodes,
        edges,
    };
}

/*
|--------------------------------------------------------------------------
| Relevant Edge IDs
|--------------------------------------------------------------------------
*/

function getRelevantEdgeIds(
    selectedId,
    edges,
) {
    const relevantIds =
        new Set();

    if (!selectedId) {
        return relevantIds;
    }

    /*
    | Upstream: selected node -> OLT
    */

    let current =
        selectedId;

    while (current) {
        const incomingEdge =
            edges.find(
                (edge) =>
                    edge.target ===
                    current,
            );

        if (!incomingEdge) {
            break;
        }

        relevantIds.add(
            incomingEdge.id,
        );

        current =
            incomingEdge.source;
    }

    /*
    | Downstream: selected node -> all children
    */

    const queue = [
        selectedId,
    ];

    const visited =
        new Set([
            selectedId,
        ]);

    while (queue.length > 0) {
        const sourceId =
            queue.shift();

        edges.forEach(
            (edge) => {
                if (
                    edge.source !==
                    sourceId
                ) {
                    return;
                }

                relevantIds.add(
                    edge.id,
                );

                if (
                    !visited.has(
                        edge.target,
                    )
                ) {
                    visited.add(
                        edge.target,
                    );

                    queue.push(
                        edge.target,
                    );
                }
            },
        );
    }

    return relevantIds;
}

/*
|--------------------------------------------------------------------------
| Professional Edge Styling
|--------------------------------------------------------------------------
|
| Initial state:
| - Online  = animated, low opacity
| - Offline = gray + dashed + static
| - LOS     = red + static
|
| Selected state:
| - Relevant path becomes strong/highlighted
| - Unrelated paths become very faint
| - Offline/LOS never animate
|
*/

function styleTopologyEdges(
    baseEdges,
    selectedId = null,
) {
    const relevantEdges =
        getRelevantEdgeIds(
            selectedId,
            baseEdges,
        );

    /*
    |--------------------------------------------------------------------------
    | Visibility
    |--------------------------------------------------------------------------
    */

    const INITIAL_OPACITY = 0.78;
    const SELECTED_OPACITY = 1;
    const DIMMED_OPACITY = 0.10;

    return baseEdges.map((edge) => {
        const connectionStatus =
            edge.data?.connectionStatus ??
            'online';

        const highlighted =
            Boolean(selectedId) &&
            relevantEdges.has(edge.id);

        const unrelated =
            Boolean(selectedId) &&
            !highlighted;

        const opacity =
            highlighted
                ? SELECTED_OPACITY
                : unrelated
                  ? DIMMED_OPACITY
                  : INITIAL_OPACITY;

        /*
        |--------------------------------------------------------------------------
        | LOS
        |--------------------------------------------------------------------------
        */

        if (connectionStatus === 'los') {
            return {
                ...edge,

                animated: false,

                style: {
                    stroke: '#dc2626',

                    strokeWidth:
                        highlighted
                            ? 3.5
                            : 2.4,

                    opacity,

                    transition:
                        'opacity 180ms ease, stroke-width 180ms ease',
                },
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Offline
        |--------------------------------------------------------------------------
        */

        if (connectionStatus === 'offline') {
            return {
                ...edge,

                animated: false,

                style: {
                    stroke: '#64748b',

                    strokeWidth:
                        highlighted
                            ? 3.5
                            : 2.4,

                    opacity,

                    strokeDasharray: '7 5',

                    transition:
                        'opacity 180ms ease, stroke-width 180ms ease',
                },
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Online
        |--------------------------------------------------------------------------
        */

        return {
            ...edge,

            animated: true,

            style: {
                stroke:
                    highlighted
                        ? '#0f766e'
                        : '#0d9488',

                strokeWidth:
                    highlighted
                        ? 3.5
                        : 2.4,

                opacity,

                transition:
                    'opacity 180ms ease, stroke-width 180ms ease',
            },
        };
    });
}
/*
|--------------------------------------------------------------------------
| Get Downstream Branch
|--------------------------------------------------------------------------
*/

function getBranchNodes(
    selectedId,
    nodes,
    edges,
) {
    if (!selectedId) {
        return [];
    }

    const branchIds =
        new Set([
            selectedId,
        ]);

    const queue = [
        selectedId,
    ];

    while (
        queue.length > 0
    ) {
        const current =
            queue.shift();

        edges.forEach(
            (edge) => {
                if (
                    edge.source ===
                        current &&
                    !branchIds.has(
                        edge.target,
                    )
                ) {
                    branchIds.add(
                        edge.target,
                    );

                    queue.push(
                        edge.target,
                    );
                }
            },
        );
    }

    return nodes.filter(
        (node) =>
            branchIds.has(
                node.id,
            ),
    );
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
| Node Details
|--------------------------------------------------------------------------
*/

function NodeDetails({
    node,
    onClose,
    onFocusNode,
    onFocusBranch,
}) {
    if (!node) {
        return (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
                <div>
                    <MapIcon className="w-10 h-10 mx-auto text-zinc-300" />

                    <p className="mt-4 text-sm font-semibold text-zinc-700">
                        Select a network node
                    </p>

                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                        Click any OLT,
                        PON port,
                        splitter,
                        distribution
                        point, ONU / ONT
                        or customer.
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
                            {data.typeLabel}
                        </p>

                        <p className="mt-1 text-base font-semibold truncate text-zinc-950">
                            {data.title}
                        </p>

                        {data.subtitle && (
                            <p className="mt-1 text-xs text-zinc-500">
                                {data.subtitle}
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
                                {data.status}
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
                            {data.meta}
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

                <div className="grid gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        icon={Crosshair}
                        onClick={() =>
                            onFocusNode(
                                node,
                            )
                        }
                    >
                        Focus Node
                    </Button>

                    {data.entityType !==
                        'customer' && (
                        <Button
                            type="button"
                            variant="secondary"
                            icon={Network}
                            onClick={() =>
                                onFocusBranch(
                                    node,
                                )
                            }
                        >
                            Focus Downstream
                        </Button>
                    )}

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
| Main
|--------------------------------------------------------------------------
*/

export default function Index({
    network = [],
    filters = {},
    oltOptions = [],
}) {
    /*
    |--------------------------------------------------------------------------
    | Default = First OLT
    |--------------------------------------------------------------------------
    */

    const defaultOltId =
        filters?.olt_id
            ? String(
                  filters.olt_id,
              )
            : oltOptions?.[0]?.id
              ? String(
                    oltOptions[0].id,
                )
              : '';

    const [
        oltId,
        setOltId,
    ] = useState(
        defaultOltId,
    );

    const [
        showCustomers,
        setShowCustomers,
    ] = useState(true);

    const [
        search,
        setSearch,
    ] = useState('');

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
    | Local OLT Filter
    |--------------------------------------------------------------------------
    */

    const visibleNetwork =
        useMemo(() => {
            if (!oltId) {
                return network;
            }

            return network.filter(
                (olt) =>
                    String(
                        olt.id,
                    ) ===
                    String(
                        oltId,
                    ),
            );
        }, [
            network,
            oltId,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Dynamic Summary
    |--------------------------------------------------------------------------
    */

    const summary =
        useMemo(
            () =>
                calculateSummary(
                    visibleNetwork,
                ),
            [
                visibleNetwork,
            ],
        );

    /*
    |--------------------------------------------------------------------------
    | Graph
    |--------------------------------------------------------------------------
    */

    const graph =
        useMemo(
            () =>
                buildGraph(
                    visibleNetwork,
                    showCustomers,
                ),
            [
                visibleNetwork,
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
        styleTopologyEdges(
            graph.edges,
        ),
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
            styleTopologyEdges(
                graph.edges,
            ),
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
                                0.16,

                            duration:
                                500,

                            maxZoom:
                                0.9,
                        },
                    );
                },
                150,
            );

        return () =>
            window.clearTimeout(
                timer,
            );
    }, [
        graph,
        flowInstance,
        setNodes,
        setEdges,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Search
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

                            ...(node.data
                                .path ??
                                []),
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
    | Fit All
    |--------------------------------------------------------------------------
    */

    function fitGraph() {
        flowInstance?.fitView(
            {
                nodes,

                padding:
                    0.16,

                duration:
                    500,

                maxZoom:
                    0.9,
            },
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Focus Node
    |--------------------------------------------------------------------------
    */

    function focusNode(
        node,
    ) {
        if (
            !flowInstance ||
            !node
        ) {
            return;
        }

        flowInstance.fitView({
            nodes: [
                node,
            ],

            padding: 0.9,

            duration: 500,

            minZoom: 0.8,

            maxZoom: 1.15,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Focus Downstream Branch
    |--------------------------------------------------------------------------
    */

    function focusBranch(
        node,
    ) {
        if (
            !flowInstance ||
            !node
        ) {
            return;
        }

        const branchNodes =
            getBranchNodes(
                node.id,
                nodes,
                edges,
            );

        if (
            branchNodes.length ===
            0
        ) {
            focusNode(
                node,
            );

            return;
        }

        flowInstance.fitView({
            nodes:
                branchNodes,

            padding: 0.22,

            duration: 600,

            minZoom: 0.18,

            maxZoom: 1.05,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Node Click
    |--------------------------------------------------------------------------
    */

    function handleNodeClick(
        _event,
        node,
    ) {
        setSelectedNode(
            node,
        );

        /*
         * Selected node-এর upstream + downstream
         * path strong highlight হবে।
         */
        setEdges(
            styleTopologyEdges(
                graph.edges,
                node.id,
            ),
        );

        /*
         * Existing behavior:
         * automatically focus selected branch.
         */
        window.setTimeout(
            () => {
                focusBranch(
                    node,
                );
            },
            50,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Clear Selection
    |--------------------------------------------------------------------------
    */

    function clearSelection() {
        setSelectedNode(
            null,
        );

        setEdges(
            styleTopologyEdges(
                graph.edges,
            ),
        );
    }

    /*
    |--------------------------------------------------------------------------
    | OLT Filter
    |--------------------------------------------------------------------------
    */

    function changeOlt(
        value,
    ) {
        const newValue =
            String(
                value ?? '',
            );

        setSearch('');

        setSelectedNode(
            null,
        );

        /*
         * যদি backend আগে specific OLT
         * filter করে শুধু একটি OLT পাঠিয়ে থাকে,
         * এবং user অন্য OLT select করে,
         * তখন backend থেকে load করব।
         */
        if (newValue) {
            const exists =
                network.some(
                    (olt) =>
                        String(
                            olt.id,
                        ) ===
                        newValue,
                );

            if (!exists) {
                setOltId(
                    newValue,
                );

                router.get(
                    route(
                        'network-map.index',
                    ),
                    {
                        olt_id:
                            newValue,
                    },
                    {
                        preserveScroll:
                            true,

                        preserveState:
                            false,

                        replace:
                            true,
                    },
                );

                return;
            }
        }

        /*
         * All OLTs selected কিন্তু backend
         * যদি specific OLT data পাঠিয়ে থাকে,
         * তাহলে complete network reload।
         */
        if (
            !newValue &&
            filters?.olt_id
        ) {
            setOltId('');

            router.get(
                route(
                    'network-map.index',
                ),
                {},
                {
                    preserveScroll:
                        true,

                    preserveState:
                        false,

                    replace:
                        true,
                },
            );

            return;
        }

        setOltId(
            newValue,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    function resetFilters() {
        const firstId =
            oltOptions?.[0]?.id
                ? String(
                      oltOptions[0].id,
                  )
                : '';

        setSearch('');

        setShowCustomers(
            true,
        );

        setSelectedNode(
            null,
        );

        setEdges(
            styleTopologyEdges(
                graph.edges,
            ),
        );

        /*
         * Backend currently filtered থাকলে
         * full network ফিরিয়ে আনো।
         */
        if (
            filters?.olt_id
        ) {
            router.get(
                route(
                    'network-map.index',
                ),
                {},
                {
                    preserveScroll:
                        true,

                    preserveState:
                        false,

                    replace:
                        true,
                },
            );

            return;
        }

        setOltId(
            firstId,
        );
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
                description="Trace the complete logical network from OLT infrastructure to the subscriber using an interactive topology graph."
                meta={
                    <StatusBadge tone="info">
                        Interactive Graph
                    </StatusBadge>
                }
            />

            {/* Summary */}
            <div className="grid gap-3 mt-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                <SummaryItem
                    icon={Server}
                    label="OLT"
                    value={
                        summary.olts
                    }
                />

                <SummaryItem
                    icon={Cable}
                    label="PON Ports"
                    value={
                        summary.pon_ports
                    }
                />

                <SummaryItem
                    icon={
                        GitBranch
                    }
                    label="Splitters"
                    value={
                        summary.splitters
                    }
                />

                <SummaryItem
                    icon={Box}
                    label="Distribution"
                    value={
                        summary.distribution_points
                    }
                />

                <SummaryItem
                    icon={Radio}
                    label="ONU / ONT"
                    value={
                        summary.onus
                    }
                />
            </div>

            {/* ONU Status */}
            <div className="flex flex-wrap gap-3 mt-3">
                <StatusBadge tone="online">
                    Online ONU:{' '}
                    {
                        summary.online_onus
                    }
                </StatusBadge>

                <StatusBadge tone="offline">
                    Offline ONU:{' '}
                    {
                        summary.offline_onus
                    }
                </StatusBadge>

                <StatusBadge tone="critical">
                    LOS ONU:{' '}
                    {
                        summary.los_onus
                    }
                </StatusBadge>
            </div>

            {/* Toolbar */}
            <Card
                className="mt-6"
                title="Topology Controls"
                description="Choose an OLT, search network assets, and control the topology view."
                icon={MapIcon}
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

                        {oltOptions.map(
                            (olt) => (
                                <option
                                    key={
                                        olt.id
                                    }
                                    value={
                                        String(
                                            olt.id,
                                        )
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
                            placeholder="Search OLT, PON, splitter, ONU..."
                            className="w-full h-10 pr-3 text-sm bg-white border rounded-lg shadow-sm border-zinc-300 pl-9 text-zinc-900 focus:border-teal-500 focus:ring-teal-500"
                        />
                    </div>

                    {/* Customer */}
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

                        Customers
                    </label>

                    {/* Focus selected */}
                    <Button
                        type="button"
                        variant="secondary"
                        icon={Crosshair}
                        disabled={
                            !selectedNode
                        }
                        onClick={() =>
                            focusNode(
                                selectedNode,
                            )
                        }
                    >
                        Focus Node
                    </Button>

                    {/* Fit */}
                    <Button
                        type="button"
                        variant="secondary"
                        icon={Maximize2}
                        onClick={fitGraph}
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

                <div className="flex flex-wrap items-center gap-4 pt-4 mt-4 text-xs border-t border-zinc-100 text-zinc-500">
                    <span>
                        <strong className="text-zinc-700">
                            Tip:
                        </strong>{' '}
                        Click a node to focus its downstream branch.
                    </span>

                    <span>
                        Drag nodes to inspect complex topology.
                    </span>

                    <span>
                        Scroll to zoom.
                    </span>
                </div>
            </Card>

            {/* Graph */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-zinc-200">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-200">
                        <div>
                            <p className="text-sm font-semibold text-zinc-950">
                                Logical Network Topology
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                                OLT → PON → Splitter → Distribution → ONU → Customer
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                            <span>
                                {nodes.length}{' '}
                                nodes
                            </span>

                            <span>•</span>

                            <span>
                                {edges.length}{' '}
                                links
                            </span>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className="h-[700px] w-full">
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
                            onNodeClick={
                                handleNodeClick
                            }
                            onPaneClick={
                                clearSelection
                            }
                            fitView
                            fitViewOptions={{
                                padding:
                                    0.16,

                                maxZoom:
                                    0.9,
                            }}
                            minZoom={0.08}
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
                                gap={24}
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

                {/* Details */}
                <div className="self-start overflow-hidden bg-white border shadow-sm rounded-2xl border-zinc-200 xl:sticky xl:top-6">
                    <NodeDetails
                        node={
                            selectedNode
                        }
                        onClose={
                            clearSelection
                        }
                        onFocusNode={
                            focusNode
                        }
                        onFocusBranch={
                            focusBranch
                        }
                    />
                </div>
            </div>

            {/* Legend */}
            <Card
                className="mt-6"
                title="Topology Legend"
                description="FTTX infrastructure levels displayed in the graph."
                icon={Network}
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
                        OLT → PON Port → Splitter → Distribution Point → ONU / ONT → Customer
                    </p>
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}


