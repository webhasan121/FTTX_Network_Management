<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFaultRequest;
use App\Http\Requests\UpdateFaultRequest;
use App\Models\DistributionPoint;
use App\Models\Fault;
use App\Models\Olt;
use App\Models\Onu;
use App\Models\PonPort;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FaultController extends Controller
{
    private const TYPES = [
        'olt_down' => 'OLT Down',
        'pon_down' => 'PON Down',
        'fiber_cut' => 'Fiber Cut',
        'low_signal' => 'Low Signal',
        'onu_offline' => 'ONU Offline',
        'los' => 'LOS',
        'power' => 'Power Issue',
        'other' => 'Other',
    ];

    private const SEVERITIES = [
        'low' => 'Low',
        'medium' => 'Medium',
        'high' => 'High',
        'critical' => 'Critical',
    ];

    private const STATUSES = [
        'open' => 'Open',
        'in_progress' => 'In Progress',
        'resolved' => 'Resolved',
    ];

    public function index(
        Request $request
    ): Response {
        Gate::authorize(
            'viewAny',
            Fault::class
        );

        $search = $request
            ->string('search')
            ->trim()
            ->toString();

        $status = $request
            ->string('status')
            ->trim()
            ->toString();

        $severity = $request
            ->string('severity')
            ->trim()
            ->toString();

        $faultType = $request
            ->string('fault_type')
            ->trim()
            ->toString();

        if (
            !array_key_exists(
                $status,
                self::STATUSES
            )
        ) {
            $status = '';
        }

        if (
            !array_key_exists(
                $severity,
                self::SEVERITIES
            )
        ) {
            $severity = '';
        }

        if (
            !array_key_exists(
                $faultType,
                self::TYPES
            )
        ) {
            $faultType = '';
        }

        $faults = Fault::query()
            ->with([
                'olt:id,name,code,status',

                'ponPort:id,olt_id,name,port_number,status',

                'ponPort.olt:id,name,code',

                'distributionPoint:id,splitter_id,name,code,type',

                'onu:id,distribution_point_id,serial_number,status,rx_power',

                'assignedUser:id,name,email',
            ])
            ->when(
                $search !== '',
                function (
                    Builder $query
                ) use ($search): void {
                    $query->where(
                        function (
                            Builder $query
                        ) use ($search): void {
                            $query
                                ->where(
                                    'title',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'description',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhereHas(
                                    'olt',
                                    fn (
                                        Builder $query
                                    ) =>
                                        $query
                                            ->where(
                                                'name',
                                                'like',
                                                "%{$search}%"
                                            )
                                            ->orWhere(
                                                'code',
                                                'like',
                                                "%{$search}%"
                                            )
                                )
                                ->orWhereHas(
                                    'ponPort',
                                    fn (
                                        Builder $query
                                    ) =>
                                        $query
                                            ->where(
                                                'name',
                                                'like',
                                                "%{$search}%"
                                            )
                                )
                                ->orWhereHas(
                                    'distributionPoint',
                                    fn (
                                        Builder $query
                                    ) =>
                                        $query
                                            ->where(
                                                'name',
                                                'like',
                                                "%{$search}%"
                                            )
                                            ->orWhere(
                                                'code',
                                                'like',
                                                "%{$search}%"
                                            )
                                )
                                ->orWhereHas(
                                    'onu',
                                    fn (
                                        Builder $query
                                    ) =>
                                        $query
                                            ->where(
                                                'serial_number',
                                                'like',
                                                "%{$search}%"
                                            )
                                );
                        }
                    );
                }
            )
            ->when(
                $status !== '',
                fn (
                    Builder $query
                ): Builder =>
                    $query->where(
                        'status',
                        $status
                    )
            )
            ->when(
                $severity !== '',
                fn (
                    Builder $query
                ): Builder =>
                    $query->where(
                        'severity',
                        $severity
                    )
            )
            ->when(
                $faultType !== '',
                fn (
                    Builder $query
                ): Builder =>
                    $query->where(
                        'fault_type',
                        $faultType
                    )
            )
            ->orderByRaw(
                "
                CASE severity
                    WHEN 'critical' THEN 1
                    WHEN 'high' THEN 2
                    WHEN 'medium' THEN 3
                    WHEN 'low' THEN 4
                    ELSE 5
                END
                "
            )
            ->latest('reported_at')
            ->paginate(10)
            ->withQueryString()
            ->through(
                fn (
                    Fault $fault
                ): array =>
                    $this->indexData(
                        $fault
                    )
            );

        return Inertia::render(
            'Fault/Index',
            [
                'faults' =>
                    $faults,

                'filters' => [
                    'search' =>
                        $search,

                    'status' =>
                        $status,

                    'severity' =>
                        $severity,

                    'fault_type' =>
                        $faultType,
                ],

                'statuses' =>
                    $this->options(
                        self::STATUSES
                    ),

                'severities' =>
                    $this->options(
                        self::SEVERITIES
                    ),

                'faultTypes' =>
                    $this->options(
                        self::TYPES
                    ),
            ]
        );
    }

    public function create(): Response
    {
        Gate::authorize(
            'create',
            Fault::class
        );

        return Inertia::render(
            'Fault/Create',
            [
                'fault' =>
                    $this->blankFormData(),

                ...$this->formOptions(),
            ]
        );
    }

    public function store(
        StoreFaultRequest $request
    ): RedirectResponse {
        $data =
            $this->prepareData(
                $request->validated()
            );

        $fault =
            Fault::create(
                $data
            );

        return redirect()
            ->route(
                'faults.show',
                $fault
            )
            ->with(
                'success',
                'Fault reported successfully.'
            );
    }

    public function show(
        Fault $fault
    ): Response {
        Gate::authorize(
            'view',
            $fault
        );

        $fault->load([
            'olt',

            'ponPort.olt',

            'distributionPoint.splitter.ponPort.olt',

            'onu.distributionPoint.splitter.ponPort.olt',

            'onu.connection.customer',

            'assignedUser',
        ]);

        return Inertia::render(
            'Fault/Show',
            [
                'fault' =>
                    $this->showData(
                        $fault
                    ),
            ]
        );
    }

    public function edit(
        Fault $fault
    ): Response {
        Gate::authorize(
            'update',
            $fault
        );

        return Inertia::render(
            'Fault/Edit',
            [
                'fault' =>
                    $this->formData(
                        $fault
                    ),

                ...$this->formOptions(),
            ]
        );
    }

    public function update(
        UpdateFaultRequest $request,
        Fault $fault
    ): RedirectResponse {
        $data =
            $this->prepareData(
                $request->validated(),
                $fault
            );

        $fault->update(
            $data
        );

        return redirect()
            ->route(
                'faults.show',
                $fault
            )
            ->with(
                'success',
                'Fault updated successfully.'
            );
    }

    public function destroy(
        Fault $fault
    ): RedirectResponse {
        Gate::authorize(
            'delete',
            $fault
        );

        $fault->delete();

        return redirect()
            ->route(
                'faults.index'
            )
            ->with(
                'success',
                'Fault deleted successfully.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Status Dates
    |--------------------------------------------------------------------------
    */

    private function prepareData(
        array $data,
        ?Fault $fault = null
    ): array {
        if (
            empty(
                $data[
                    'reported_at'
                ]
            )
        ) {
            $data['reported_at'] =
                $fault?->reported_at
                ?? now();
        }

        if (
            $data['status'] ===
            'resolved'
        ) {
            if (
                empty(
                    $data[
                        'resolved_at'
                    ]
                )
            ) {
                $data['resolved_at'] =
                    $fault?->resolved_at
                    ?? now();
            }
        } else {
            $data['resolved_at'] =
                null;
        }

        return $data;
    }

    /*
    |--------------------------------------------------------------------------
    | Index Data
    |--------------------------------------------------------------------------
    */

    private function indexData(
        Fault $fault
    ): array {
        return [
            'id' =>
                $fault->id,

            'title' =>
                $fault->title,

            'fault_type' =>
                $fault->fault_type,

            'fault_type_label' =>
                self::TYPES[
                    $fault->fault_type
                ] ??
                $fault->fault_type,

            'severity' =>
                $fault->severity,

            'severity_label' =>
                self::SEVERITIES[
                    $fault->severity
                ] ??
                $fault->severity,

            'status' =>
                $fault->status,

            'status_label' =>
                self::STATUSES[
                    $fault->status
                ] ??
                $fault->status,

            'asset' =>
                $this->assetData(
                    $fault
                ),

            'assigned_user' =>
                $fault->assignedUser
                    ? [
                        'id' =>
                            $fault
                                ->assignedUser
                                ->id,

                        'name' =>
                            $fault
                                ->assignedUser
                                ->name,
                    ]
                    : null,

            'reported_at' =>
                $fault->reported_at
                    ?->diffForHumans(),

            'resolved_at' =>
                $fault->resolved_at
                    ?->diffForHumans(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Show Data
    |--------------------------------------------------------------------------
    */

    private function showData(
        Fault $fault
    ): array {
        return [
            ...$fault->toArray(),

            'fault_type_label' =>
                self::TYPES[
                    $fault->fault_type
                ] ??
                $fault->fault_type,

            'severity_label' =>
                self::SEVERITIES[
                    $fault->severity
                ] ??
                $fault->severity,

            'status_label' =>
                self::STATUSES[
                    $fault->status
                ] ??
                $fault->status,

            'asset' =>
                $this->assetData(
                    $fault
                ),

            'reported_at_formatted' =>
                $fault->reported_at
                    ?->toDayDateTimeString(),

            'resolved_at_formatted' =>
                $fault->resolved_at
                    ?->toDayDateTimeString(),

            'created_at_formatted' =>
                $fault->created_at
                    ?->toDayDateTimeString(),

            'updated_at_formatted' =>
                $fault->updated_at
                    ?->toDayDateTimeString(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Linked Network Asset
    |--------------------------------------------------------------------------
    */

    private function assetData(
        Fault $fault
    ): ?array {
        if ($fault->onu) {
            return [
                'type' =>
                    'ONU / ONT',

                'name' =>
                    $fault->onu
                        ->serial_number,

                'id' =>
                    $fault->onu->id,

                'route' =>
                    'onu-ont.show',
            ];
        }

        if (
            $fault->distributionPoint
        ) {
            return [
                'type' =>
                    'Distribution Point',

                'name' =>
                    $fault
                        ->distributionPoint
                        ->code,

                'id' =>
                    $fault
                        ->distributionPoint
                        ->id,

                'route' =>
                    'distribution-points.show',
            ];
        }

        if ($fault->ponPort) {
            return [
                'type' =>
                    'PON Port',

                'name' =>
                    $fault
                        ->ponPort
                        ->name,

                'id' =>
                    $fault
                        ->ponPort
                        ->id,

                'route' =>
                    'pon-ports.show',
            ];
        }

        if ($fault->olt) {
            return [
                'type' =>
                    'OLT',

                'name' =>
                    $fault->olt->code,

                'id' =>
                    $fault->olt->id,

                'route' =>
                    'olts.show',
            ];
        }

        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Form Data
    |--------------------------------------------------------------------------
    */

    private function formData(
        Fault $fault
    ): array {
        return [
            'id' =>
                $fault->id,

            'title' =>
                $fault->title,

            'fault_type' =>
                $fault->fault_type,

            'severity' =>
                $fault->severity,

            'status' =>
                $fault->status,

            'olt_id' =>
                $fault->olt_id
                ?? '',

            'pon_port_id' =>
                $fault->pon_port_id
                ?? '',

            'distribution_point_id' =>
                $fault
                    ->distribution_point_id
                ?? '',

            'onu_id' =>
                $fault->onu_id
                ?? '',

            'assigned_to' =>
                $fault->assigned_to
                ?? '',

            'reported_at' =>
                $fault->reported_at
                    ?->format(
                        'Y-m-d\TH:i'
                    ),

            'resolved_at' =>
                $fault->resolved_at
                    ?->format(
                        'Y-m-d\TH:i'
                    ),

            'description' =>
                $fault->description,
        ];
    }

    private function blankFormData(): array
    {
        return [
            'title' => '',

            'fault_type' =>
                'onu_offline',

            'severity' =>
                'medium',

            'status' =>
                'open',

            'olt_id' => '',

            'pon_port_id' => '',

            'distribution_point_id' =>
                '',

            'onu_id' => '',

            'assigned_to' => '',

            'reported_at' =>
                now()->format(
                    'Y-m-d\TH:i'
                ),

            'resolved_at' => '',

            'description' => '',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Form Options
    |--------------------------------------------------------------------------
    */

    private function formOptions(): array
    {
        return [
            'statuses' =>
                $this->options(
                    self::STATUSES
                ),

            'severities' =>
                $this->options(
                    self::SEVERITIES
                ),

            'faultTypes' =>
                $this->options(
                    self::TYPES
                ),

            'olts' =>
                Olt::query()
                    ->select([
                        'id',
                        'name',
                        'code',
                        'status',
                    ])
                    ->orderBy(
                        'name'
                    )
                    ->get(),

            'ponPorts' =>
                PonPort::query()
                    ->with(
                        'olt:id,name,code'
                    )
                    ->select([
                        'id',
                        'olt_id',
                        'name',
                        'port_number',
                        'status',
                    ])
                    ->orderBy(
                        'name'
                    )
                    ->get(),

            'distributionPoints' =>
                DistributionPoint::query()
                    ->select([
                        'id',
                        'name',
                        'code',
                        'type',
                    ])
                    ->orderBy(
                        'name'
                    )
                    ->get(),

            'onus' =>
                Onu::query()
                    ->select([
                        'id',
                        'serial_number',
                        'status',
                        'rx_power',
                    ])
                    ->orderBy(
                        'serial_number'
                    )
                    ->get(),

            'users' =>
                User::query()
                    ->select([
                        'id',
                        'name',
                        'email',
                        'role',
                    ])
                    ->orderBy(
                        'name'
                    )
                    ->get(),
        ];
    }

    private function options(
        array $items
    ): array {
        return collect($items)
            ->map(
                fn (
                    string $label,
                    string $value
                ): array => [
                    'value' =>
                        $value,

                    'label' =>
                        $label,
                ]
            )
            ->values()
            ->all();
    }
}
