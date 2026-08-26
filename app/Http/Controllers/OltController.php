<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOltRequest;
use App\Http\Requests\UpdateOltRequest;
use App\Models\Olt;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OltController extends Controller
{
    private const STATUSES = [
        'online' => 'Online',
        'offline' => 'Offline',
        'maintenance' => 'Maintenance',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Olt::class);

        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $status = array_key_exists($status, self::STATUSES) ? $status : '';

        $olts = Olt::query()
            ->select([
                'id',
                'name',
                'code',
                'vendor',
                'model',
                'ip_address',
                'location_name',
                'total_pon_ports',
                'status',
                'updated_at',
            ])
            ->withCount('ponPorts')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('vendor', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('location_name', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Olt $olt): array => $this->indexData($olt));

        return Inertia::render('OLT/Index', [
            'olts' => $olts,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statuses' => $this->statusOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create', Olt::class);

        return Inertia::render('OLT/Create', [
            'olt' => $this->blankFormData(),
            'statuses' => $this->statusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOltRequest $request): RedirectResponse
    {
        $olt = Olt::create($request->validated());

        return redirect()
            ->route('olts.show', $olt)
            ->with('success', 'OLT created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Olt $olt): Response
    {
        Gate::authorize('view', $olt);

        $olt->loadCount('ponPorts');
        $olt->load([
            'ponPorts' => function ($query): void {
                $query
                    ->select([
                        'id',
                        'olt_id',
                        'name',
                        'port_number',
                        'capacity',
                        'status',
                        'description',
                    ])
                    ->orderBy('port_number');
            },
        ]);

        return Inertia::render('OLT/Show', [
            'olt' => $this->showData($olt),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Olt $olt): Response
    {
        Gate::authorize('update', $olt);

        return Inertia::render('OLT/Edit', [
            'olt' => $this->formData($olt),
            'statuses' => $this->statusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOltRequest $request, Olt $olt): RedirectResponse
    {
        $olt->update($request->validated());

        return redirect()
            ->route('olts.show', $olt)
            ->with('success', 'OLT updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Olt $olt): RedirectResponse
    {
        Gate::authorize('delete', $olt);

        $olt->delete();

        return redirect()
            ->route('olts.index')
            ->with('success', 'OLT deleted successfully.');
    }

    private function indexData(Olt $olt): array
    {
        return [
            'id' => $olt->id,
            'name' => $olt->name,
            'code' => $olt->code,
            'vendor' => $olt->vendor,
            'model' => $olt->model,
            'ip_address' => $olt->ip_address,
            'location_name' => $olt->location_name,
            'total_pon_ports' => $olt->total_pon_ports,
            'pon_ports_count' => $olt->pon_ports_count,
            'status' => $olt->status,
            'status_label' => self::STATUSES[$olt->status] ?? $olt->status,
            'updated_at' => $olt->updated_at?->diffForHumans(),
        ];
    }

    private function showData(Olt $olt): array
    {
        return [
            ...$this->formData($olt),
            'status_label' => self::STATUSES[$olt->status] ?? $olt->status,
            'connected_pon_ports_count' => $olt->pon_ports_count,
            'created_at' => $olt->created_at?->toDayDateTimeString(),
            'updated_at' => $olt->updated_at?->toDayDateTimeString(),
            'pon_ports' => $olt->ponPorts
                ->map(fn ($ponPort): array => [
                    'id' => $ponPort->id,
                    'name' => $ponPort->name,
                    'port_number' => $ponPort->port_number,
                    'capacity' => $ponPort->capacity,
                    'status' => $ponPort->status,
                    'description' => $ponPort->description,
                ])
                ->all(),
        ];
    }

    private function formData(Olt $olt): array
    {
        return [
            'id' => $olt->id,
            'name' => $olt->name,
            'code' => $olt->code,
            'vendor' => $olt->vendor,
            'model' => $olt->model,
            'ip_address' => $olt->ip_address,
            'location_name' => $olt->location_name,
            'latitude' => $olt->latitude,
            'longitude' => $olt->longitude,
            'total_pon_ports' => $olt->total_pon_ports,
            'status' => $olt->status,
            'description' => $olt->description,
        ];
    }

    private function blankFormData(): array
    {
        return [
            'name' => '',
            'code' => '',
            'vendor' => '',
            'model' => '',
            'ip_address' => '',
            'location_name' => '',
            'latitude' => '',
            'longitude' => '',
            'total_pon_ports' => 0,
            'status' => 'offline',
            'description' => '',
        ];
    }

    private function statusOptions(): array
    {
        return collect(self::STATUSES)
            ->map(fn (string $label, string $value): array => [
                'value' => $value,
                'label' => $label,
            ])
            ->values()
            ->all();
    }
}
