import {
    Box,
    Cable,
    GitBranch,
    LayoutDashboard,
    Map,
    MapPinned,
    Network,
    Radio,
    Server,
    Settings,
    TriangleAlert,
    UserCog,
    Users,
} from 'lucide-react';

export const sidebarItems = [
    {
        label: 'Dashboard',
        route: 'dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'OLTs',
        route: 'olts.index',
        icon: Server,
    },
    {
        label: 'PON Ports',
        route: 'pon-ports.index',
        icon: Cable,
    },
    {
        label: 'Splitters',
        route: 'splitters.index',
        icon: GitBranch,
    },
    {
        label: 'Distribution Points',
        route: 'distribution-points.index',
        icon: MapPinned,
    },
    {
        label: 'ONU / ONT',
        route: 'onu-ont.index',
        icon: Radio,
    },
    {
        label: 'Customers',
        route: 'customers.index',
        icon: Users,
    },
    {
        label: 'Connections',
        route: 'connections.index',
        icon: Network,
    },
    {
        label: 'Network Map',
        route: 'network-map.index',
        icon: Map,
    },
    {
        label: 'Faults',
        route: 'faults.index',
        icon: TriangleAlert,
    },
    {
        label: 'Settings',
        route: 'settings.index',
        icon: Settings,
    },
];
