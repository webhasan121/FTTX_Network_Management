<?php

namespace App\Http\Controllers;

use App\Models\Olt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class NetworkMapController extends Controller
{
    public function index(Request $request): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        |
        | Network Map মূলত OLT থেকে পুরো downstream network দেখায়।
        | তাই existing OLT view permission ব্যবহার করছি।
        |
        */

        Gate::authorize('viewAny', Olt::class);

        $selectedOltId = $request->integer('olt_id');

        /*
        |--------------------------------------------------------------------------
        | Load Complete FTTX Hierarchy
        |--------------------------------------------------------------------------
        */

        $olts = Olt::query()
            ->with([
                'ponPorts' => function ($query): void {
                    $query
                        ->orderBy('port_number');
                },

                'ponPorts.splitters' => function ($query): void {
                    $query
                        ->orderBy('name');
                },

                'ponPorts.splitters.distributionPoints' => function ($query): void {
                    $query
                        ->orderBy('name');
                },

                'ponPorts.splitters.distributionPoints.onus' => function ($query): void {
                    $query
                        ->with([
                            'connection.customer',
                        ])
                        ->orderBy('serial_number');
                },
            ])
            ->when(
                $selectedOltId > 0,
                fn($query) =>
                $query->where(
                    'id',
                    $selectedOltId
                )
            )
            ->orderBy('name')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Convert Data For Frontend
        |--------------------------------------------------------------------------
        */

        $network = $olts
            ->map(
                fn(Olt $olt): array =>
                $this->oltData($olt)
            )
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Dashboard Summary
        |--------------------------------------------------------------------------
        */

        $summary = [
            'olts' => $network->count(),

            'pon_ports' => $network
                ->sum(
                    fn(array $olt): int =>
                    count($olt['pon_ports'])
                ),

            'splitters' => $network
                ->sum(
                    fn(array $olt): int =>
                    collect($olt['pon_ports'])
                        ->sum(
                            fn(array $pon): int =>
                            count($pon['splitters'])
                        )
                ),

            'distribution_points' => $network
                ->sum(
                    fn(array $olt): int =>
                    collect($olt['pon_ports'])
                        ->sum(
                            fn(array $pon): int =>
                            collect($pon['splitters'])
                                ->sum(
                                    fn(array $splitter): int =>
                                    count(
                                        $splitter['distribution_points']
                                    )
                                )
                        )
                ),

            'onus' => $network
                ->sum(
                    fn(array $olt): int =>
                    collect($olt['pon_ports'])
                        ->sum(
                            fn(array $pon): int =>
                            collect($pon['splitters'])
                                ->sum(
                                    fn(array $splitter): int =>
                                    collect(
                                        $splitter['distribution_points']
                                    )->sum(
                                        fn(array $point): int =>
                                        count(
                                            $point['onus']
                                        )
                                    )
                                )
                        )
                ),
        ];

        /*
        |--------------------------------------------------------------------------
        | ONU Status Summary
        |--------------------------------------------------------------------------
        */

        $allOnus = $network
            ->flatMap(
                fn(array $olt) =>
                collect($olt['pon_ports'])
                    ->flatMap(
                        fn(array $pon) =>
                        collect($pon['splitters'])
                            ->flatMap(
                                fn(array $splitter) =>
                                collect(
                                    $splitter['distribution_points']
                                )->flatMap(
                                    fn(array $point) =>
                                    $point['onus']
                                )
                            )
                    )
            );

        $summary['online_onus'] =
            $allOnus
            ->where('status', 'online')
            ->count();

        $summary['offline_onus'] =
            $allOnus
            ->where('status', 'offline')
            ->count();

        $summary['los_onus'] =
            $allOnus
            ->where('status', 'los')
            ->count();

        return Inertia::render(
            'NetworkMap/Index',
            [
                'network' => $network,

                'summary' => $summary,

                'filters' => [
                    'olt_id' =>
                    $selectedOltId ?: '',
                ],

                'oltOptions' =>
                $this->oltOptions(),
            ]
        );
    }

    private function oltData(
        Olt $olt
    ): array {
        return [
            'id' => $olt->id,

            'name' => $olt->name,

            'code' => $olt->code,

            'vendor' => $olt->vendor,

            'model' => $olt->model,

            'ip_address' =>
            $olt->ip_address,

            'location_name' =>
            $olt->location_name,

            'latitude' =>
            $olt->latitude,

            'longitude' =>
            $olt->longitude,

            'status' =>
            $olt->status,

            'pon_ports' =>
            $olt->ponPorts
                ->map(
                    function ($pon): array {
                        return [
                            'id' =>
                            $pon->id,

                            'name' =>
                            $pon->name,

                            'port_number' =>
                            $pon->port_number,

                            'capacity' =>
                            $pon->capacity,

                            'status' =>
                            $pon->status,

                            'splitters' =>
                            $pon->splitters
                                ->map(
                                    function ($splitter): array {
                                        return [
                                            'id' =>
                                            $splitter->id,

                                            'name' =>
                                            $splitter->name,

                                            'code' =>
                                            $splitter->code,

                                            'ratio' =>
                                            $splitter->ratio,

                                            'total_ports' =>
                                            $splitter->total_ports,

                                            'used_ports' =>
                                            $splitter->used_ports,

                                            'location_name' =>
                                            $splitter->location_name,

                                            'latitude' =>
                                            $splitter->latitude,

                                            'longitude' =>
                                            $splitter->longitude,

                                            'distribution_points' =>
                                            $splitter
                                                ->distributionPoints
                                                ->map(
                                                    function ($point): array {
                                                        return [
                                                            'id' =>
                                                            $point->id,

                                                            'name' =>
                                                            $point->name,

                                                            'code' =>
                                                            $point->code,

                                                            'type' =>
                                                            $point->type,

                                                            'total_ports' =>
                                                            $point->total_ports,

                                                            'used_ports' =>
                                                            $point->used_ports,

                                                            'location_name' =>
                                                            $point->location_name,

                                                            'address' =>
                                                            $point->address,

                                                            'latitude' =>
                                                            $point->latitude,

                                                            'longitude' =>
                                                            $point->longitude,

                                                            'onus' =>
                                                            $point
                                                                ->onus
                                                                ->map(
                                                                    function ($onu): array {
                                                                        return [
                                                                            'id' =>
                                                                            $onu->id,

                                                                            'serial_number' =>
                                                                            $onu->serial_number,

                                                                            'vendor' =>
                                                                            $onu->vendor,

                                                                            'model' =>
                                                                            $onu->model,

                                                                            'rx_power' =>
                                                                            $onu->rx_power,

                                                                            'tx_power' =>
                                                                            $onu->tx_power,

                                                                            'status' =>
                                                                            $onu->status,

                                                                            'customer' =>
                                                                            $onu
                                                                                ->connection
                                                                                ?->customer
                                                                                ? [
                                                                                    'id' =>
                                                                                    $onu
                                                                                        ->connection
                                                                                        ->customer
                                                                                        ->id,

                                                                                    'customer_code' =>
                                                                                    $onu
                                                                                        ->connection
                                                                                        ->customer
                                                                                        ->customer_code,

                                                                                    'name' =>
                                                                                    $onu
                                                                                        ->connection
                                                                                        ->customer
                                                                                        ->name,

                                                                                    'area' =>
                                                                                    $onu
                                                                                        ->connection
                                                                                        ->customer
                                                                                        ->area,
                                                                                ]
                                                                                : null,
                                                                        ];
                                                                    }
                                                                )
                                                                ->values()
                                                                ->all(),
                                                        ];
                                                    }
                                                )
                                                ->values()
                                                ->all(),
                                        ];
                                    }
                                )
                                ->values()
                                ->all(),
                        ];
                    }
                )
                ->values()
                ->all(),
        ];
    }

    private function oltOptions()
    {
        return Olt::query()
            ->select([
                'id',
                'name',
                'code',
                'status',
            ])
            ->orderBy('name')
            ->get();
    }
}
