<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOltRequest;
use App\Http\Requests\UpdateOltRequest;
use App\Models\Olt;
use App\Services\OltService;
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

    public function __construct(
        private readonly OltService $oltService
    ) {
    }

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Olt::class);

        $search = $request
            ->string('search')
            ->trim()
            ->toString();

        $status = $request
            ->string('status')
            ->trim()
            ->toString();

        $status = array_key_exists(
            $status,
            self::STATUSES
        )
            ? $status
            : '';

        $olts = $this->oltService
            ->paginate(
                search: $search,
                status: $status,
                perPage: 10,
            )
            ->through(
                fn (Olt $olt): array =>
                    $this->indexData($olt)
            );

        return Inertia::render('OLT/Index', [
            'olts' => $olts,

            'filters' => [
                'search' => $search,
                'status' => $status,
            ],

            'statuses' => $this->statusOptions(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Olt::class);

        return Inertia::render('OLT/Create', [
            'olt' => $this->blankFormData(),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function store(
        StoreOltRequest $request
    ): RedirectResponse {
        Gate::authorize('create', Olt::class);

        $olt = $this->oltService->store(
            $request->validated()
        );

        return redirect()
            ->route('olts.show', $olt)
            ->with(
                'success',
                'OLT created successfully.'
            );
    }

    public function show(Olt $olt): Response
    {
        Gate::authorize('view', $olt);

        $olt = $this->oltService->show($olt);

        return Inertia::render('OLT/Show', [
            'olt' => $this->showData($olt),
        ]);
    }

    public function edit(Olt $olt): Response
    {
        Gate::authorize('update', $olt);

        return Inertia::render('OLT/Edit', [
            'olt' => $this->formData($olt),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(
        UpdateOltRequest $request,
        Olt $olt
    ): RedirectResponse {
        Gate::authorize('update', $olt);

        $olt = $this->oltService->update(
            $olt,
            $request->validated()
        );

        return redirect()
            ->route('olts.show', $olt)
            ->with(
                'success',
                'OLT updated successfully.'
            );
    }

    public function destroy(Olt $olt): RedirectResponse
    {
        Gate::authorize('delete', $olt);

        $this->oltService->destroy($olt);

        return redirect()
            ->route('olts.index')
            ->with(
                'success',
                'OLT moved to trash successfully.'
            );
    }

    public function trash(): Response
    {
        Gate::authorize('viewAny', Olt::class);

        $olts = $this->oltService
            ->trashed(perPage: 10)
            ->through(
                fn (Olt $olt): array =>
                    $this->trashData($olt)
            );

        return Inertia::render('OLT/Trash', [
            'olts' => $olts,
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        $olt = $this->oltService
            ->findTrashed($id);

        Gate::authorize('restore', $olt);

        $this->oltService->restore($olt);

        return redirect()
            ->route('olts.trash')
            ->with(
                'success',
                'OLT restored successfully.'
            );
    }

    public function forceDelete(
        int $id
    ): RedirectResponse {
        $olt = $this->oltService
            ->findTrashed($id);

        Gate::authorize('forceDelete', $olt);

        $this->oltService->forceDelete($olt);

        return redirect()
            ->route('olts.trash')
            ->with(
                'success',
                'OLT permanently deleted.'
            );
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
            'status_label' =>
                self::STATUSES[$olt->status]
                ?? $olt->status,
            'updated_at' =>
                $olt->updated_at?->diffForHumans(),
        ];
    }

    private function showData(Olt $olt): array
    {
        return [
            ...$this->formData($olt),

            'status_label' =>
                self::STATUSES[$olt->status]
                ?? $olt->status,

            'connected_pon_ports_count' =>
                $olt->pon_ports_count,

            'created_at' =>
                $olt->created_at
                    ?->toDayDateTimeString(),

            'updated_at' =>
                $olt->updated_at
                    ?->toDayDateTimeString(),

            'pon_ports' => $olt->ponPorts
                ->map(
                    fn ($ponPort): array => [
                        'id' => $ponPort->id,
                        'name' => $ponPort->name,
                        'port_number' =>
                            $ponPort->port_number,
                        'capacity' =>
                            $ponPort->capacity,
                        'status' =>
                            $ponPort->status,
                        'description' =>
                            $ponPort->description,
                    ]
                )
                ->all(),
        ];
    }

    private function trashData(Olt $olt): array
    {
        return [
            'id' => $olt->id,
            'name' => $olt->name,
            'code' => $olt->code,
            'vendor' => $olt->vendor,
            'model' => $olt->model,
            'ip_address' => $olt->ip_address,
            'status' => $olt->status,

            'status_label' =>
                self::STATUSES[$olt->status]
                ?? $olt->status,

            'deleted_at' =>
                $olt->deleted_at?->diffForHumans(),
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
}
