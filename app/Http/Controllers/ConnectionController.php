<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConnectionRequest;
use App\Http\Requests\UpdateConnectionRequest;
use App\Models\Connection;
use App\Models\Customer;
use App\Models\Onu;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    private const STATUSES = [
        'active' => 'Active',
        'inactive' => 'Inactive',
        'disconnected' => 'Disconnected',
    ];

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Connection::class);

        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $customerId = $request->integer('customer_id');

        $status = array_key_exists($status, self::STATUSES)
            ? $status
            : '';

        $connections = Connection::query()
            ->with([
                'customer:id,customer_code,name,phone,area,status',

                'onu:id,distribution_point_id,serial_number,mac_address,vendor,model,rx_power,status',

                'onu.distributionPoint:id,splitter_id,code,name,type',

                'onu.distributionPoint.splitter:id,pon_port_id,code,name,ratio',

                'onu.distributionPoint.splitter.ponPort:id,olt_id,name,port_number',

                'onu.distributionPoint.splitter.ponPort.olt:id,name,code',
            ])
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query
                            ->where(
                                'connection_code',
                                'like',
                                "%{$search}%"
                            )
                            ->orWhereHas(
                                'customer',
                                function (Builder $query) use ($search): void {
                                    $query
                                        ->where(
                                            'name',
                                            'like',
                                            "%{$search}%"
                                        )
                                        ->orWhere(
                                            'customer_code',
                                            'like',
                                            "%{$search}%"
                                        )
                                        ->orWhere(
                                            'phone',
                                            'like',
                                            "%{$search}%"
                                        );
                                }
                            )
                            ->orWhereHas(
                                'onu',
                                function (Builder $query) use ($search): void {
                                    $query
                                        ->where(
                                            'serial_number',
                                            'like',
                                            "%{$search}%"
                                        )
                                        ->orWhere(
                                            'mac_address',
                                            'like',
                                            "%{$search}%"
                                        );
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
                $customerId > 0,
                fn (Builder $query): Builder =>
                    $query->where(
                        'customer_id',
                        $customerId
                    )
            )
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Connection/Index', [
            'connections' => $connections,

            'filters' => [
                'search' => $search,
                'status' => $status,
                'customer_id' => $customerId ?: '',
            ],

            'statuses' => $this->statusOptions(),

            'customers' => $this->customerOptions(),
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', Connection::class);

        $customerId = $request->integer('customer_id');

        return Inertia::render('Connection/Create', [
            'connection' => [
                ...$this->blankFormData(),

                'customer_id' =>
                    $customerId > 0
                        ? $customerId
                        : '',
            ],

            'statuses' => $this->statusOptions(),

            'customers' => $this->customerOptions(),

            'onus' => $this->onuOptions(),
        ]);
    }

    public function store(
        StoreConnectionRequest $request
    ): RedirectResponse {
        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | Automatic status timestamps
        |--------------------------------------------------------------------------
        */

        if (
            $data['status'] === 'active'
            && empty($data['activated_at'])
        ) {
            $data['activated_at'] = now();
        }

        if (
            $data['status'] === 'disconnected'
            && empty($data['disconnected_at'])
        ) {
            $data['disconnected_at'] = now();
        }

        if ($data['status'] !== 'disconnected') {
            $data['disconnected_at'] = null;
        }

        $connection = Connection::create($data);

        return redirect()
            ->route(
                'connections.show',
                $connection
            )
            ->with(
                'success',
                'FTTX connection created successfully.'
            );
    }

    public function show(Connection $connection): Response
    {
        Gate::authorize('view', $connection);

        $connection->load([
            'customer',

            'onu.distributionPoint.splitter.ponPort.olt',
        ]);

        return Inertia::render('Connection/Show', [
            'connection' => [
                ...$connection->toArray(),

                'status_label' =>
                    self::STATUSES[$connection->status]
                    ?? $connection->status,

                'activated_at_formatted' =>
                    $connection->activated_at
                        ?->toDayDateTimeString(),

                'disconnected_at_formatted' =>
                    $connection->disconnected_at
                        ?->toDayDateTimeString(),

                'created_at_formatted' =>
                    $connection->created_at
                        ?->toDayDateTimeString(),

                'updated_at_formatted' =>
                    $connection->updated_at
                        ?->toDayDateTimeString(),

                'network_path' =>
                    $this->networkPathData($connection),
            ],
        ]);
    }

    public function edit(Connection $connection): Response
    {
        Gate::authorize('update', $connection);

        return Inertia::render('Connection/Edit', [
            'connection' =>
                $this->formData($connection),

            'statuses' =>
                $this->statusOptions(),

            'customers' =>
                $this->customerOptions(),

            /*
             * Current ONU-টাও option-এ রাখতে হবে।
             * কারণ এটি already এই connection-এর সাথে linked।
             */
            'onus' =>
                $this->onuOptions(
                    $connection->onu_id
                ),
        ]);
    }

    public function update(
        UpdateConnectionRequest $request,
        Connection $connection
    ): RedirectResponse {
        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | Status transition handling
        |--------------------------------------------------------------------------
        */

        if ($data['status'] === 'active') {
            if (empty($data['activated_at'])) {
                $data['activated_at'] =
                    $connection->activated_at
                    ?? now();
            }

            $data['disconnected_at'] = null;
        }

        if (
            $data['status'] === 'disconnected'
            && empty($data['disconnected_at'])
        ) {
            $data['disconnected_at'] =
                $connection->disconnected_at
                ?? now();
        }

        if ($data['status'] === 'inactive') {
            $data['disconnected_at'] = null;
        }

        $connection->update($data);

        return redirect()
            ->route(
                'connections.show',
                $connection
            )
            ->with(
                'success',
                'FTTX connection updated successfully.'
            );
    }

    public function destroy(
        Connection $connection
    ): RedirectResponse {
        Gate::authorize('delete', $connection);

        /*
         * Active connection সরাসরি delete না করে
         * আগে disconnected করা safer.
         */
        if ($connection->status === 'active') {
            return back()->with(
                'error',
                'Active connections cannot be deleted. Disconnect the connection first.'
            );
        }

        $connection->delete();

        return redirect()
            ->route('connections.index')
            ->with(
                'success',
                'Connection deleted successfully.'
            );
    }

    private function formData(
        Connection $connection
    ): array {
        return [
            'id' =>
                $connection->id,

            'customer_id' =>
                $connection->customer_id,

            'onu_id' =>
                $connection->onu_id,

            'connection_code' =>
                $connection->connection_code,

            'status' =>
                $connection->status,

            'activated_at' =>
                $connection->activated_at
                    ?->format('Y-m-d\TH:i'),

            'disconnected_at' =>
                $connection->disconnected_at
                    ?->format('Y-m-d\TH:i'),

            'notes' =>
                $connection->notes,
        ];
    }

    private function blankFormData(): array
    {
        return [
            'customer_id' => '',
            'onu_id' => '',
            'connection_code' => '',
            'status' => 'active',
            'activated_at' => '',
            'disconnected_at' => '',
            'notes' => '',
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

    private function customerOptions()
    {
        return Customer::query()
            ->select([
                'id',
                'customer_code',
                'name',
                'phone',
                'area',
                'status',
            ])
            ->orderBy('name')
            ->get();
    }

    private function onuOptions(
        ?int $currentOnuId = null
    ) {
        return Onu::query()
            ->with([
                'distributionPoint:id,splitter_id,code,name,type',

                'distributionPoint.splitter:id,pon_port_id,code,name',

                'distributionPoint.splitter.ponPort:id,olt_id,name,port_number',

                'distributionPoint.splitter.ponPort.olt:id,name,code',
            ])
            ->select([
                'id',
                'distribution_point_id',
                'serial_number',
                'mac_address',
                'vendor',
                'model',
                'rx_power',
                'status',
            ])
            ->where(function (Builder $query) use ($currentOnuId): void {
                /*
                 * নতুন connection-এর জন্য শুধু unassigned ONU।
                 *
                 * Edit-এর সময় current ONU-টা list-এ থাকবে।
                 */
                $query->whereDoesntHave('connection');

                if ($currentOnuId) {
                    $query->orWhere(
                        'id',
                        $currentOnuId
                    );
                }
            })
            ->orderBy('serial_number')
            ->get();
    }

    private function networkPathData(
        Connection $connection
    ): array {
        $onu = $connection->onu;

        $point =
            $onu?->distributionPoint;

        $splitter =
            $point?->splitter;

        $pon =
            $splitter?->ponPort;

        $olt =
            $pon?->olt;

        return [
            'olt' => $olt
                ? [
                    'id' => $olt->id,
                    'name' => $olt->name,
                    'code' => $olt->code,
                ]
                : null,

            'pon_port' => $pon
                ? [
                    'id' => $pon->id,
                    'name' => $pon->name,
                    'port_number' =>
                        $pon->port_number,
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

            'onu' => $onu
                ? [
                    'id' => $onu->id,
                    'serial_number' =>
                        $onu->serial_number,
                    'status' => $onu->status,
                    'rx_power' =>
                        $onu->rx_power,
                ]
                : null,
        ];
    }
}
