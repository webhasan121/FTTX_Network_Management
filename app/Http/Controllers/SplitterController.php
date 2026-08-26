<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSplitterRequest;
use App\Http\Requests\UpdateSplitterRequest;
use App\Models\PonPort;
use App\Models\Splitter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SplitterController extends Controller
{
    private const RATIOS = [
        '1:2',
        '1:4',
        '1:8',
        '1:16',
        '1:32',
        '1:64',
    ];

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Splitter::class);

        $search = $request->string('search')->trim()->toString();
        $ponPortId = $request->integer('pon_port_id');
        $ratio = $request->string('ratio')->trim()->toString();

        $ratio = in_array($ratio, self::RATIOS, true)
            ? $ratio
            : '';

        $splitters = Splitter::query()
            ->with([
                'ponPort:id,olt_id,name,port_number',
                'ponPort.olt:id,name,code',
            ])
            ->withCount('distributionPoints')
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%")
                            ->orWhere('location_name', 'like', "%{$search}%")
                            ->orWhereHas(
                                'ponPort',
                                function (Builder $query) use ($search): void {
                                    $query->where(
                                        'name',
                                        'like',
                                        "%{$search}%"
                                    );
                                }
                            )
                            ->orWhereHas(
                                'ponPort.olt',
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
                $ponPortId > 0,
                fn (Builder $query): Builder =>
                    $query->where('pon_port_id', $ponPortId)
            )
            ->when(
                $ratio !== '',
                fn (Builder $query): Builder =>
                    $query->where('ratio', $ratio)
            )
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Splitter/Index', [
            'splitters' => $splitters,

            'filters' => [
                'search' => $search,
                'pon_port_id' => $ponPortId ?: '',
                'ratio' => $ratio,
            ],

            'ponPorts' => $this->ponPortOptions(),
            'ratios' => self::RATIOS,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Splitter::class);

        return Inertia::render('Splitter/Create', [
            'splitter' => $this->blankFormData(),
            'ponPorts' => $this->ponPortOptions(),
            'ratios' => self::RATIOS,
        ]);
    }

    public function store(
        StoreSplitterRequest $request
    ): RedirectResponse {
        $splitter = Splitter::create(
            $request->validated()
        );

        return redirect()
            ->route('splitters.show', $splitter)
            ->with(
                'success',
                'Splitter created successfully.'
            );
    }

    public function show(
        Splitter $splitter
    ): Response {
        Gate::authorize('view', $splitter);

        $splitter->load([
            'ponPort.olt',
            'distributionPoints' => function ($query): void {
                $query
                    ->select([
                        'id',
                        'splitter_id',
                        'code',
                        'name',
                        'type',
                        'total_ports',
                        'used_ports',
                        'location_name',
                    ])
                    ->orderBy('name');
            },
        ]);

        $splitter->loadCount('distributionPoints');

        return Inertia::render('Splitter/Show', [
            'splitter' => $splitter,
        ]);
    }

    public function edit(
        Splitter $splitter
    ): Response {
        Gate::authorize('update', $splitter);

        return Inertia::render('Splitter/Edit', [
            'splitter' => $splitter,
            'ponPorts' => $this->ponPortOptions(),
            'ratios' => self::RATIOS,
        ]);
    }

    public function update(
        UpdateSplitterRequest $request,
        Splitter $splitter
    ): RedirectResponse {
        $splitter->update(
            $request->validated()
        );

        return redirect()
            ->route('splitters.show', $splitter)
            ->with(
                'success',
                'Splitter updated successfully.'
            );
    }

    public function destroy(
        Splitter $splitter
    ): RedirectResponse {
        Gate::authorize('delete', $splitter);

        if ($splitter->distributionPoints()->exists()) {
            return back()->with(
                'error',
                'This splitter cannot be deleted because distribution points are connected to it.'
            );
        }

        $splitter->delete();

        return redirect()
            ->route('splitters.index')
            ->with(
                'success',
                'Splitter deleted successfully.'
            );
    }

    private function blankFormData(): array
    {
        return [
            'pon_port_id' => '',
            'code' => '',
            'name' => '',
            'ratio' => '1:8',
            'total_ports' => 8,
            'used_ports' => 0,
            'location_name' => '',
            'latitude' => '',
            'longitude' => '',
            'description' => '',
        ];
    }

    private function ponPortOptions()
    {
        return PonPort::query()
            ->with('olt:id,name,code')
            ->select([
                'id',
                'olt_id',
                'name',
                'port_number',
                'status',
            ])
            ->orderBy('olt_id')
            ->orderBy('port_number')
            ->get();
    }
}
