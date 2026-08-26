<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePonPortRequest;
use App\Http\Requests\UpdatePonPortRequest;
use App\Models\Olt;
use App\Models\Onu;
use App\Models\PonPort;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PonPortController extends Controller
{
    private const STATUSES = [
        'active' => 'Active',
        'disabled' => 'Disabled',
    ];

    /**
     * Display a listing of PON ports.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', PonPort::class);

        $search = $request->string('search')->trim()->toString();
        $oltId = $request->integer('olt_id');
        $status = $request->string('status')->trim()->toString();

        $status = array_key_exists($status, self::STATUSES)
            ? $status
            : '';

        $ports = PonPort::query()
            ->select([
                'id',
                'olt_id',
                'name',
                'port_number',
                'capacity',
                'status',
                'description',
                'updated_at',
            ])
            ->with([
                'olt:id,name,code',
            ])
            ->withCount('splitters')
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('port_number', 'like', "%{$search}%")
                            ->orWhereHas('olt', function ($query) use ($search): void {
                                $query
                                    ->where('name', 'like', "%{$search}%")
                                    ->orWhere('code', 'like', "%{$search}%");
                            });
                    });
                }
            )
            ->when(
                $oltId > 0,
                fn (Builder $query): Builder =>
                    $query->where('olt_id', $oltId)
            )
            ->when(
                $status !== '',
                fn (Builder $query): Builder =>
                    $query->where('status', $status)
            )
            ->orderBy('olt_id')
            ->orderBy('port_number')
            ->paginate(10)
            ->withQueryString()
            ->through(
                fn (PonPort $port): array =>
                    $this->indexData($port)
            );

        return Inertia::render('PON/Index', [
            'ports' => $ports,

            'filters' => [
                'search' => $search,
                'olt_id' => $oltId ?: '',
                'status' => $status,
            ],

            'statuses' => $this->statusOptions(),

            'olts' => $this->oltOptions(),
        ]);
    }

    /**
     * Show create form.
     */
    public function create(): Response
    {
        Gate::authorize('create', PonPort::class);

        return Inertia::render('PON/Create', [
            'port' => $this->blankFormData(),
            'statuses' => $this->statusOptions(),
            'olts' => $this->oltOptions(),
        ]);
    }

    /**
     * Store new PON port.
     */
    public function store(
        StorePonPortRequest $request
    ): RedirectResponse {
        $port = PonPort::create(
            $request->validated()
        );

        return redirect()
            ->route('pon-ports.show', $port)
            ->with(
                'success',
                'PON port created successfully.'
            );
    }

    /**
     * Display PON details.
     */
    public function show(PonPort $ponPort): Response
    {
        Gate::authorize('view', $ponPort);

        $ponPort->loadCount('splitters');

        $ponPort->load([
            'olt:id,name,code,vendor,model,status',

            'splitters' => function ($query): void {
                $query
                    ->select([
                        'id',
                        'pon_port_id',
                        'code',
                        'name',
                        'ratio',
                        'total_ports',
                        'used_ports',
                        'location_name',
                    ])
                    ->orderBy('name');
            },
        ]);

        $connectedOnus = Onu::query()
            ->whereHas(
                'distributionPoint.splitter',
                function ($query) use ($ponPort): void {
                    $query->where(
                        'pon_port_id',
                        $ponPort->id
                    );
                }
            )
            ->count();

        return Inertia::render('PON/Show', [
            'port' => $this->showData(
                $ponPort,
                $connectedOnus
            ),
        ]);
    }

    /**
     * Show edit form.
     */
    public function edit(PonPort $ponPort): Response
    {
        Gate::authorize('update', $ponPort);

        return Inertia::render('PON/Edit', [
            'port' => $this->formData($ponPort),
            'statuses' => $this->statusOptions(),
            'olts' => $this->oltOptions(),
        ]);
    }

    /**
     * Update PON port.
     */
    public function update(
        UpdatePonPortRequest $request,
        PonPort $ponPort
    ): RedirectResponse {
        $ponPort->update(
            $request->validated()
        );

        return redirect()
            ->route('pon-ports.show', $ponPort)
            ->with(
                'success',
                'PON port updated successfully.'
            );
    }

    /**
     * Delete PON port.
     */
    public function destroy(PonPort $ponPort): RedirectResponse
    {
        Gate::authorize('delete', $ponPort);

        if ($ponPort->splitters()->exists()) {
            return back()->with(
                'error',
                'This PON port cannot be deleted because splitters are connected to it.'
            );
        }

        $ponPort->delete();

        return redirect()
            ->route('pon-ports.index')
            ->with(
                'success',
                'PON port deleted successfully.'
            );
    }

    /**
     * Index data.
     */
    private function indexData(PonPort $port): array
    {
        return [
            'id' => $port->id,
            'name' => $port->name,
            'port_number' => $port->port_number,
            'capacity' => $port->capacity,

            'splitters_count' =>
                $port->splitters_count,

            'status' => $port->status,

            'status_label' =>
                self::STATUSES[$port->status]
                    ?? $port->status,

            'updated_at' =>
                $port->updated_at?->diffForHumans(),

            'olt' => [
                'id' => $port->olt->id,
                'name' => $port->olt->name,
                'code' => $port->olt->code,
            ],
        ];
    }

    /**
     * Show page data.
     */
    private function showData(
        PonPort $port,
        int $connectedOnus
    ): array {
        return [
            ...$this->formData($port),

            'status_label' =>
                self::STATUSES[$port->status]
                    ?? $port->status,

            'splitters_count' =>
                $port->splitters_count,

            'connected_onus_count' =>
                $connectedOnus,

            'available_capacity' =>
                max(
                    $port->capacity - $connectedOnus,
                    0
                ),

            'utilization_percentage' =>
                $port->capacity > 0
                    ? round(
                        ($connectedOnus / $port->capacity) * 100,
                        1
                    )
                    : 0,

            'created_at' =>
                $port->created_at?->toDayDateTimeString(),

            'updated_at' =>
                $port->updated_at?->toDayDateTimeString(),

            'olt' => [
                'id' => $port->olt->id,
                'name' => $port->olt->name,
                'code' => $port->olt->code,
                'vendor' => $port->olt->vendor,
                'model' => $port->olt->model,
                'status' => $port->olt->status,
            ],

            'splitters' => $port->splitters
                ->map(fn ($splitter): array => [
                    'id' => $splitter->id,
                    'code' => $splitter->code,
                    'name' => $splitter->name,
                    'ratio' => $splitter->ratio,
                    'total_ports' => $splitter->total_ports,
                    'used_ports' => $splitter->used_ports,
                    'location_name' => $splitter->location_name,
                ])
                ->all(),
        ];
    }

    /**
     * Edit/create form data.
     */
    private function formData(PonPort $port): array
    {
        return [
            'id' => $port->id,
            'olt_id' => $port->olt_id,
            'name' => $port->name,
            'port_number' => $port->port_number,
            'capacity' => $port->capacity,
            'status' => $port->status,
            'description' => $port->description,
        ];
    }

    private function blankFormData(): array
    {
        return [
            'olt_id' => '',
            'name' => '',
            'port_number' => '',
            'capacity' => 128,
            'status' => 'active',
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

    private function oltOptions()
    {
        return Olt::query()
            ->select([
                'id',
                'name',
                'code',
                'total_pon_ports',
                'status',
            ])
            ->orderBy('name')
            ->get();
    }
}
