<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOnuRequest;
use App\Http\Requests\UpdateOnuRequest;
use App\Models\DistributionPoint;
use App\Models\Onu;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OnuController extends Controller
{
    private const STATUSES = [
        'online' => 'Online',
        'offline' => 'Offline',
        'los' => 'LOS',
        'disabled' => 'Disabled',
    ];

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Onu::class);

        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $distributionPointId = $request->integer('distribution_point_id');

        $status = array_key_exists($status, self::STATUSES)
            ? $status
            : '';

        $onus = Onu::query()
            ->with([
                'distributionPoint:id,splitter_id,name,code,type',
                'distributionPoint.splitter:id,pon_port_id,name,code',
                'distributionPoint.splitter.ponPort:id,olt_id,name,port_number',
                'distributionPoint.splitter.ponPort.olt:id,name,code',
                'connection.customer:id,customer_code,name',
            ])
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query
                            ->where('serial_number', 'like', "%{$search}%")
                            ->orWhere('mac_address', 'like', "%{$search}%")
                            ->orWhere('vendor', 'like', "%{$search}%")
                            ->orWhere('model', 'like', "%{$search}%")
                            ->orWhereHas(
                                'distributionPoint',
                                function (Builder $query) use ($search): void {
                                    $query
                                        ->where('name', 'like', "%{$search}%")
                                        ->orWhere('code', 'like', "%{$search}%");
                                }
                            )
                            ->orWhereHas(
                                'connection.customer',
                                function (Builder $query) use ($search): void {
                                    $query
                                        ->where('name', 'like', "%{$search}%")
                                        ->orWhere('customer_code', 'like', "%{$search}%");
                                }
                            );
                    });
                }
            )
            ->when(
                $status !== '',
                fn (Builder $query): Builder =>
                    $query->where('status', $status)
            )
            ->when(
                $distributionPointId > 0,
                fn (Builder $query): Builder =>
                    $query->where(
                        'distribution_point_id',
                        $distributionPointId
                    )
            )
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(
                fn (Onu $onu): array =>
                    $this->indexData($onu)
            );

        return Inertia::render('ONU/Index', [
            'onus' => $onus,

            'filters' => [
                'search' => $search,
                'status' => $status,
                'distribution_point_id' =>
                    $distributionPointId ?: '',
            ],

            'statuses' => $this->statusOptions(),

            'distributionPoints' =>
                $this->distributionPointOptions(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Onu::class);

        return Inertia::render('ONU/Create', [
            'onu' => $this->blankFormData(),

            'statuses' => $this->statusOptions(),

            'distributionPoints' =>
                $this->distributionPointOptions(),
        ]);
    }

    public function store(
        StoreOnuRequest $request
    ): RedirectResponse {
        $onu = Onu::create(
            $request->validated()
        );

        return redirect()
            ->route('onu-ont.show', $onu)
            ->with(
                'success',
                'ONU / ONT created successfully.'
            );
    }

    public function show(Onu $onu): Response
    {
        Gate::authorize('view', $onu);

        $onu->load([
            'distributionPoint.splitter.ponPort.olt',

            'connection.customer',
        ]);

        return Inertia::render('ONU/Show', [
            'onu' => $this->showData($onu),
        ]);
    }

    public function edit(Onu $onu): Response
    {
        Gate::authorize('update', $onu);

        return Inertia::render('ONU/Edit', [
            'onu' => $this->formData($onu),

            'statuses' => $this->statusOptions(),

            'distributionPoints' =>
                $this->distributionPointOptions(),
        ]);
    }

    public function update(
        UpdateOnuRequest $request,
        Onu $onu
    ): RedirectResponse {
        $onu->update(
            $request->validated()
        );

        return redirect()
            ->route('onu-ont.show', $onu)
            ->with(
                'success',
                'ONU / ONT updated successfully.'
            );
    }

    public function destroy(Onu $onu): RedirectResponse
    {
        Gate::authorize('delete', $onu);

        if ($onu->connection()->exists()) {
            return back()->with(
                'error',
                'This ONU / ONT cannot be deleted because a customer connection is assigned to it.'
            );
        }

        $onu->delete();

        return redirect()
            ->route('onu-ont.index')
            ->with(
                'success',
                'ONU / ONT deleted successfully.'
            );
    }

    private function indexData(Onu $onu): array
    {
        return [
            'id' => $onu->id,

            'serial_number' =>
                $onu->serial_number,

            'mac_address' =>
                $onu->mac_address,

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

            'status_label' =>
                self::STATUSES[$onu->status]
                ?? $onu->status,

            'last_seen_at' =>
                $onu->last_seen_at?->diffForHumans(),

            'distribution_point' =>
                $onu->distributionPoint
                    ? [
                        'id' =>
                            $onu->distributionPoint->id,

                        'name' =>
                            $onu->distributionPoint->name,

                        'code' =>
                            $onu->distributionPoint->code,

                        'type' =>
                            $onu->distributionPoint->type,

                        'splitter' => [
                            'id' =>
                                $onu->distributionPoint
                                    ->splitter?->id,

                            'code' =>
                                $onu->distributionPoint
                                    ->splitter?->code,

                            'pon_port' => [
                                'id' =>
                                    $onu->distributionPoint
                                        ->splitter
                                        ?->ponPort?->id,

                                'name' =>
                                    $onu->distributionPoint
                                        ->splitter
                                        ?->ponPort?->name,

                                'olt' => [
                                    'id' =>
                                        $onu->distributionPoint
                                            ->splitter
                                            ?->ponPort
                                            ?->olt?->id,

                                    'code' =>
                                        $onu->distributionPoint
                                            ->splitter
                                            ?->ponPort
                                            ?->olt?->code,
                                ],
                            ],
                        ],
                    ]
                    : null,

            'customer' =>
                $onu->connection?->customer
                    ? [
                        'id' =>
                            $onu->connection
                                ->customer->id,

                        'code' =>
                            $onu->connection
                                ->customer
                                ->customer_code,

                        'name' =>
                            $onu->connection
                                ->customer->name,
                    ]
                    : null,
        ];
    }

    private function showData(Onu $onu): array
    {
        return [
            ...$this->formData($onu),

            'status_label' =>
                self::STATUSES[$onu->status]
                ?? $onu->status,

            'last_seen_at' =>
                $onu->last_seen_at
                    ?->toDayDateTimeString(),

            'installed_at' =>
                $onu->installed_at
                    ?->toDayDateTimeString(),

            'created_at' =>
                $onu->created_at
                    ?->toDayDateTimeString(),

            'updated_at' =>
                $onu->updated_at
                    ?->toDayDateTimeString(),

            'network_path' =>
                $this->networkPathData($onu),

            'connection' =>
                $onu->connection
                    ? [
                        'id' =>
                            $onu->connection->id,

                        'connection_code' =>
                            $onu->connection
                                ->connection_code,

                        'status' =>
                            $onu->connection->status,

                        'activated_at' =>
                            $onu->connection
                                ->activated_at
                                ?->toDayDateTimeString(),

                        'customer' =>
                            $onu->connection->customer
                                ? [
                                    'id' =>
                                        $onu->connection
                                            ->customer->id,

                                    'customer_code' =>
                                        $onu->connection
                                            ->customer
                                            ->customer_code,

                                    'name' =>
                                        $onu->connection
                                            ->customer->name,

                                    'phone' =>
                                        $onu->connection
                                            ->customer->phone,

                                    'area' =>
                                        $onu->connection
                                            ->customer->area,
                                ]
                                : null,
                    ]
                    : null,
        ];
    }

    private function networkPathData(Onu $onu): array
    {
        $point = $onu->distributionPoint;

        $splitter = $point?->splitter;

        $ponPort = $splitter?->ponPort;

        $olt = $ponPort?->olt;

        return [
            'olt' => $olt
                ? [
                    'id' => $olt->id,
                    'name' => $olt->name,
                    'code' => $olt->code,
                ]
                : null,

            'pon_port' => $ponPort
                ? [
                    'id' => $ponPort->id,
                    'name' => $ponPort->name,
                    'port_number' =>
                        $ponPort->port_number,
                ]
                : null,

            'splitter' => $splitter
                ? [
                    'id' => $splitter->id,
                    'name' => $splitter->name,
                    'code' => $splitter->code,
                    'ratio' => $splitter->ratio,
                ]
                : null,

            'distribution_point' => $point
                ? [
                    'id' => $point->id,
                    'name' => $point->name,
                    'code' => $point->code,
                    'type' => $point->type,
                ]
                : null,
        ];
    }

    private function formData(Onu $onu): array
    {
        return [
            'id' => $onu->id,

            'distribution_point_id' =>
                $onu->distribution_point_id,

            'serial_number' =>
                $onu->serial_number,

            'mac_address' =>
                $onu->mac_address,

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

            'last_seen_at' =>
                $onu->last_seen_at
                    ?->format('Y-m-d\TH:i'),

            'installed_at' =>
                $onu->installed_at
                    ?->format('Y-m-d\TH:i'),

            'description' =>
                $onu->description,
        ];
    }

    private function blankFormData(): array
    {
        return [
            'distribution_point_id' => '',
            'serial_number' => '',
            'mac_address' => '',
            'vendor' => '',
            'model' => '',
            'rx_power' => '',
            'tx_power' => '',
            'status' => 'offline',
            'last_seen_at' => '',
            'installed_at' => '',
            'description' => '',
        ];
    }

    private function statusOptions(): array
    {
        return collect(self::STATUSES)
            ->map(
                fn (
                    string $label,
                    string $value
                ): array => [
                    'value' => $value,
                    'label' => $label,
                ]
            )
            ->values()
            ->all();
    }

    private function distributionPointOptions()
    {
        return DistributionPoint::query()
            ->with([
                'splitter:id,pon_port_id,code,name',
                'splitter.ponPort:id,olt_id,name,port_number',
                'splitter.ponPort.olt:id,name,code',
            ])
            ->select([
                'id',
                'splitter_id',
                'name',
                'code',
                'type',
                'total_ports',
                'used_ports',
            ])
            ->orderBy('name')
            ->get();
    }
}
