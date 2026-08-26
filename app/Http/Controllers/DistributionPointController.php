<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDistributionPointRequest;
use App\Http\Requests\UpdateDistributionPointRequest;
use App\Models\DistributionPoint;
use App\Models\Splitter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DistributionPointController extends Controller
{
    private const TYPES = [
        'fdb' => 'FDB',
        'fat' => 'FAT',
        'nap' => 'NAP',
        'odp' => 'ODP',
    ];

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', DistributionPoint::class);

        $search = $request->string('search')->trim()->toString();
        $splitterId = $request->integer('splitter_id');
        $type = $request->string('type')->trim()->toString();

        $type = array_key_exists($type, self::TYPES)
            ? $type
            : '';

        $points = DistributionPoint::query()
            ->with([
                'splitter:id,pon_port_id,name,code,ratio',
                'splitter.ponPort:id,olt_id,name,port_number',
                'splitter.ponPort.olt:id,name,code',
            ])
            ->withCount('onus')
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%")
                            ->orWhere('location_name', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%")
                            ->orWhereHas(
                                'splitter',
                                function (Builder $query) use ($search): void {
                                    $query
                                        ->where('name', 'like', "%{$search}%")
                                        ->orWhere('code', 'like', "%{$search}%");
                                }
                            );
                    });
                }
            )
            ->when(
                $splitterId > 0,
                fn (Builder $query): Builder =>
                    $query->where('splitter_id', $splitterId)
            )
            ->when(
                $type !== '',
                fn (Builder $query): Builder =>
                    $query->where('type', $type)
            )
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('DistributionPoint/Index', [
            'points' => $points,

            'filters' => [
                'search' => $search,
                'splitter_id' => $splitterId ?: '',
                'type' => $type,
            ],

            'types' => $this->typeOptions(),

            'splitters' => $this->splitterOptions(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', DistributionPoint::class);

        return Inertia::render('DistributionPoint/Create', [
            'point' => $this->blankFormData(),
            'types' => $this->typeOptions(),
            'splitters' => $this->splitterOptions(),
        ]);
    }

    public function store(
        StoreDistributionPointRequest $request
    ): RedirectResponse {
        $point = DistributionPoint::create(
            $request->validated()
        );

        return redirect()
            ->route('distribution-points.show', $point)
            ->with(
                'success',
                'Distribution point created successfully.'
            );
    }

    public function show(
        DistributionPoint $distributionPoint
    ): Response {
        Gate::authorize('view', $distributionPoint);

        $distributionPoint->load([
            'splitter.ponPort.olt',

            'onus' => function ($query): void {
                $query
                    ->select([
                        'id',
                        'distribution_point_id',
                        'serial_number',
                        'mac_address',
                        'vendor',
                        'model',
                        'rx_power',
                        'tx_power',
                        'status',
                        'last_seen_at',
                    ])
                    ->orderBy('serial_number');
            },
        ]);

        $distributionPoint->loadCount('onus');

        return Inertia::render('DistributionPoint/Show', [
            'point' => [
                ...$distributionPoint->toArray(),

                'type_label' =>
                    self::TYPES[$distributionPoint->type]
                    ?? strtoupper($distributionPoint->type),

                'available_ports' => max(
                    $distributionPoint->total_ports
                    - $distributionPoint->used_ports,
                    0
                ),

                'utilization_percentage' =>
                    $distributionPoint->total_ports > 0
                        ? round(
                            (
                                $distributionPoint->used_ports
                                / $distributionPoint->total_ports
                            ) * 100,
                            1
                        )
                        : 0,
            ],
        ]);
    }

    public function edit(
        DistributionPoint $distributionPoint
    ): Response {
        Gate::authorize('update', $distributionPoint);

        return Inertia::render('DistributionPoint/Edit', [
            'point' => $distributionPoint,
            'types' => $this->typeOptions(),
            'splitters' => $this->splitterOptions(),
        ]);
    }

    public function update(
        UpdateDistributionPointRequest $request,
        DistributionPoint $distributionPoint
    ): RedirectResponse {
        $distributionPoint->update(
            $request->validated()
        );

        return redirect()
            ->route(
                'distribution-points.show',
                $distributionPoint
            )
            ->with(
                'success',
                'Distribution point updated successfully.'
            );
    }

    public function destroy(
        DistributionPoint $distributionPoint
    ): RedirectResponse {
        Gate::authorize('delete', $distributionPoint);

        if ($distributionPoint->onus()->exists()) {
            return back()->with(
                'error',
                'This distribution point cannot be deleted because ONUs are connected to it.'
            );
        }

        $distributionPoint->delete();

        return redirect()
            ->route('distribution-points.index')
            ->with(
                'success',
                'Distribution point deleted successfully.'
            );
    }

    private function blankFormData(): array
    {
        return [
            'splitter_id' => '',
            'code' => '',
            'name' => '',
            'type' => 'fdb',
            'total_ports' => 16,
            'used_ports' => 0,
            'location_name' => '',
            'address' => '',
            'latitude' => '',
            'longitude' => '',
            'description' => '',
        ];
    }

    private function typeOptions(): array
    {
        return collect(self::TYPES)
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

    private function splitterOptions()
    {
        return Splitter::query()
            ->with([
                'ponPort:id,olt_id,name,port_number',
                'ponPort.olt:id,name,code',
            ])
            ->select([
                'id',
                'pon_port_id',
                'name',
                'code',
                'ratio',
                'total_ports',
                'used_ports',
            ])
            ->orderBy('name')
            ->get();
    }
}
