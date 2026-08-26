<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\DistributionPoint;
use App\Models\Fault;
use App\Models\Olt;
use App\Models\Onu;
use App\Models\PonPort;
use App\Models\Splitter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const RESOLVED_FAULT_STATUSES = [
        'resolved',
        'closed',
    ];

    public function index(): Response
    {
        $onuCounts = $this->onuCounts();
        $faultCounts = $this->faultCounts();

        return Inertia::render('Dashboard', [
            'stats' => $this->stats($onuCounts, $faultCounts),
            'onuStatus' => $this->onuStatus($onuCounts),
            'ponUtilization' => $this->topPonUtilization(),
            'recentFaults' => $this->recentFaults(),
            'offlineOnus' => $this->recentlyOfflineOnus(),
            'snapshot' => $this->snapshot($onuCounts, $faultCounts),
            'lastUpdated' => now()->toIso8601String(),
        ]);
    }

    private function stats(object $onuCounts, object $faultCounts): array
    {
        $oltCounts = Olt::query()
            ->toBase()
            ->selectRaw('count(*) as total')
            ->selectRaw("count(case when status = 'online' then 1 end) as online")
            ->selectRaw("count(case when status = 'maintenance' then 1 end) as maintenance")
            ->first();

        $ponCounts = PonPort::query()
            ->toBase()
            ->selectRaw('count(*) as total')
            ->selectRaw("count(case when status = 'active' then 1 end) as active")
            ->selectRaw("count(case when status = 'disabled' then 1 end) as disabled")
            ->first();

        $customerCounts = Customer::query()
            ->toBase()
            ->selectRaw('count(*) as total')
            ->selectRaw("count(case when status = 'active' then 1 end) as active")
            ->first();

        $splittersCount = Splitter::query()->count();

        return [
            [
                'key' => 'olts',
                'label' => 'Total OLT',
                'value' => (int) $oltCounts->total,
                'detail' => $this->oltDetail($oltCounts),
                'icon' => 'Server',
                'tone' => 'teal',
            ],
            [
                'key' => 'pon_ports',
                'label' => 'Total PON Ports',
                'value' => (int) $ponCounts->total,
                'detail' => "{$ponCounts->active} active, {$ponCounts->disabled} disabled",
                'icon' => 'Cable',
                'tone' => 'cyan',
            ],
            [
                'key' => 'splitters',
                'label' => 'Total Splitters',
                'value' => $splittersCount,
                'detail' => $splittersCount > 0 ? 'Passive splitter inventory' : 'No splitters registered yet',
                'icon' => 'GitBranch',
                'tone' => 'zinc',
            ],
            [
                'key' => 'onus',
                'label' => 'Total ONU/ONT',
                'value' => (int) $onuCounts->total,
                'detail' => 'Provisioned customer edge units',
                'icon' => 'Radio',
                'tone' => 'teal',
            ],
            [
                'key' => 'online_onus',
                'label' => 'Online ONU',
                'value' => (int) $onuCounts->online,
                'detail' => "{$this->percentage($onuCounts->online, $onuCounts->total)}% online rate",
                'icon' => 'Wifi',
                'tone' => 'emerald',
            ],
            [
                'key' => 'offline_onus',
                'label' => 'Offline ONU',
                'value' => (int) $onuCounts->offline,
                'detail' => "{$onuCounts->los} LOS, {$onuCounts->disabled} disabled",
                'icon' => 'WifiOff',
                'tone' => 'red',
            ],
            [
                'key' => 'customers',
                'label' => 'Total Customers',
                'value' => (int) $customerCounts->total,
                'detail' => "{$customerCounts->active} active subscriber records",
                'icon' => 'Users',
                'tone' => 'cyan',
            ],
            [
                'key' => 'active_faults',
                'label' => 'Active Faults',
                'value' => (int) $faultCounts->active,
                'detail' => "{$faultCounts->critical} critical, {$faultCounts->major} major",
                'icon' => 'TriangleAlert',
                'tone' => 'amber',
            ],
        ];
    }

    private function onuCounts(): object
    {
        return Onu::query()
            ->toBase()
            ->selectRaw('count(*) as total')
            ->selectRaw("count(case when status = 'online' then 1 end) as online")
            ->selectRaw("count(case when status = 'offline' then 1 end) as offline")
            ->selectRaw("count(case when status = 'los' then 1 end) as los")
            ->selectRaw("count(case when status = 'disabled' then 1 end) as disabled")
            ->first();
    }

    private function faultCounts(): object
    {
        return Fault::query()
            ->whereNotIn('status', self::RESOLVED_FAULT_STATUSES)
            ->toBase()
            ->selectRaw('count(*) as active')
            ->selectRaw("count(case when severity = 'critical' then 1 end) as critical")
            ->selectRaw("count(case when severity = 'major' then 1 end) as major")
            ->first();
    }

    private function onuStatus(object $onuCounts): array
    {
        $total = (int) $onuCounts->total;

        return collect([
            ['label' => 'Online', 'value' => (int) $onuCounts->online, 'color' => '#10b981', 'tone' => 'online'],
            ['label' => 'Offline', 'value' => (int) $onuCounts->offline, 'color' => '#ef4444', 'tone' => 'offline'],
            ['label' => 'LOS', 'value' => (int) $onuCounts->los, 'color' => '#f59e0b', 'tone' => 'warning'],
            ['label' => 'Disabled', 'value' => (int) $onuCounts->disabled, 'color' => '#71717a', 'tone' => 'neutral'],
        ])
            ->map(function (array $status) use ($total): array {
                $status['percentage'] = $this->percentage($status['value'], $total);

                return $status;
            })
            ->all();
    }

    private function topPonUtilization(): array
    {
        $splittersTable = (new Splitter)->getTable();
        $distributionPointsTable = (new DistributionPoint)->getTable();
        $onusTable = (new Onu)->getTable();

        return PonPort::query()
            ->select(['id', 'olt_id', 'name', 'port_number', 'capacity'])
            ->with('olt:id,code,location_name')
            ->withCount([
                'splitters as used_onus_count' => function (Builder $query) use ($splittersTable, $distributionPointsTable, $onusTable): void {
                    $query
                        ->join($distributionPointsTable, "{$distributionPointsTable}.splitter_id", '=', "{$splittersTable}.id")
                        ->join($onusTable, "{$onusTable}.distribution_point_id", '=', "{$distributionPointsTable}.id");
                },
            ])
            ->orderByDesc('used_onus_count')
            ->orderBy('port_number')
            ->limit(5)
            ->get()
            ->map(fn (PonPort $ponPort): array => [
                'port' => $this->ponPortLabel($ponPort),
                'area' => $ponPort->olt?->location_name ?? 'Unassigned POP',
                'used' => (int) $ponPort->used_onus_count,
                'capacity' => (int) $ponPort->capacity,
            ])
            ->all();
    }

    private function recentFaults(): array
    {
        return Fault::query()
            ->select([
                'id',
                'title',
                'severity',
                'status',
                'olt_id',
                'pon_port_id',
                'distribution_point_id',
                'onu_id',
                'reported_at',
            ])
            ->with([
                'olt:id,code,location_name',
                'ponPort:id,olt_id,name,port_number',
                'ponPort.olt:id,code,location_name',
                'distributionPoint:id,code,location_name',
                'onu:id,serial_number,status',
            ])
            ->orderByDesc('reported_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (Fault $fault): array => [
                'ticket' => sprintf('FLT-%04d', $fault->id),
                'title' => $fault->title,
                'severity' => Str::headline($fault->severity),
                'node' => $this->faultNode($fault),
                'area' => $this->faultArea($fault),
                'status' => Str::headline($fault->status),
                'opened' => $fault->reported_at?->diffForHumans() ?? 'Not reported',
            ])
            ->all();
    }

    private function recentlyOfflineOnus(): array
    {
        return Onu::query()
            ->select([
                'id',
                'distribution_point_id',
                'serial_number',
                'rx_power',
                'status',
                'last_seen_at',
            ])
            ->with([
                'distributionPoint:id,splitter_id,code,location_name',
                'distributionPoint.splitter:id,pon_port_id,code,name',
                'distributionPoint.splitter.ponPort:id,olt_id,name,port_number',
                'distributionPoint.splitter.ponPort.olt:id,code,location_name',
                'connection:id,onu_id,customer_id,status',
                'connection.customer:id,customer_code,name,area',
            ])
            ->whereIn('status', ['offline', 'los'])
            ->orderByDesc('last_seen_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (Onu $onu): array => [
                'id' => $onu->serial_number,
                'customer' => $this->onuCustomer($onu),
                'area' => $onu->connection?->customer?->area
                    ?? $onu->distributionPoint?->location_name
                    ?? 'Unknown area',
                'port' => $this->onuPonPortLabel($onu),
                'lastSeen' => $onu->last_seen_at?->diffForHumans() ?? 'Never seen',
                'rxPower' => $onu->rx_power === null ? 'N/A' : "{$onu->rx_power} dBm",
            ])
            ->all();
    }

    private function snapshot(object $onuCounts, object $faultCounts): array
    {
        $totalPonCapacity = (int) PonPort::query()->sum('capacity');
        $averagePonLoad = $totalPonCapacity > 0
            ? $this->percentage($onuCounts->total, $totalPonCapacity)
            : 0;

        return [
            'onlineRate' => $this->percentage($onuCounts->online, $onuCounts->total),
            'offlineDevices' => (int) $onuCounts->offline + (int) $onuCounts->los + (int) $onuCounts->disabled,
            'criticalFaults' => (int) $faultCounts->critical,
            'averagePonLoad' => $averagePonLoad,
        ];
    }

    private function percentage(int|float $value, int|float $total): float
    {
        if ($total <= 0) {
            return 0;
        }

        return round(($value / $total) * 100, 1);
    }

    private function oltDetail(object $oltCounts): string
    {
        if ((int) $oltCounts->total === 0) {
            return 'No OLTs registered yet';
        }

        return "{$oltCounts->online} online, {$oltCounts->maintenance} maintenance";
    }

    private function ponPortLabel(PonPort $ponPort): string
    {
        if (! $ponPort->olt) {
            return $ponPort->name;
        }

        return "{$ponPort->olt->code} / {$ponPort->name}";
    }

    private function faultNode(Fault $fault): string
    {
        if ($fault->onu) {
            return $fault->onu->serial_number;
        }

        if ($fault->distributionPoint) {
            return $fault->distributionPoint->code;
        }

        if ($fault->ponPort) {
            return $this->ponPortLabel($fault->ponPort);
        }

        return $fault->olt?->code ?? 'Network';
    }

    private function faultArea(Fault $fault): string
    {
        return $fault->distributionPoint?->location_name
            ?? $fault->ponPort?->olt?->location_name
            ?? $fault->olt?->location_name
            ?? 'Unassigned';
    }

    private function onuCustomer(Onu $onu): string
    {
        $customer = $onu->connection?->customer;

        if (! $customer) {
            return 'Unassigned customer';
        }

        return "{$customer->name} ({$customer->customer_code})";
    }

    private function onuPonPortLabel(Onu $onu): string
    {
        $ponPort = $onu->distributionPoint?->splitter?->ponPort;

        if (! $ponPort) {
            return 'Unassigned PON';
        }

        return $this->ponPortLabel($ponPort);
    }
}
