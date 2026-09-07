<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OltResource;
use App\Models\Olt;
use App\Services\OltService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreOltRequest;
use App\Http\Requests\UpdateOltRequest;

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

    public function index(
        Request $request
    ): AnonymousResourceCollection {
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

        $olts = $this->oltService->paginate(
            search: $search,
            status: $status,
            perPage: 10,
        );

        return OltResource::collection($olts);
    }

    public function show(Olt $olt): OltResource
    {
        Gate::authorize('view', $olt);

        $olt = $this->oltService->show($olt);

        return new OltResource($olt);
    }
    public function store(StoreOltRequest $request): JsonResponse
    {
        Gate::authorize('create', Olt::class);

        $olt = $this->oltService->store(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'OLT created successfully.',
            'data' => new OltResource($olt),
        ], 201);
    }


    public function update(
        UpdateOltRequest $request,
        Olt $olt
    ): JsonResponse {
        Gate::authorize('update', $olt);

        $olt = $this->oltService->update(
            $olt,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'OLT updated successfully.',
            'data' => new OltResource($olt),
        ]);
    }

    public function destroy(Olt $olt): JsonResponse
    {
        Gate::authorize('delete', $olt);

        $this->oltService->destroy($olt);

        return response()->json([
            'success' => true,
            'message' => 'OLT deleted successfully.',
        ]);
    }

    public function trash(): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Olt::class);

        $olts = $this->oltService->trashed(
            perPage: 10
        );

        return OltResource::collection($olts);
    }
    public function restore(int $id): JsonResponse
    {
        $olt = $this->oltService->findTrashed($id);

        Gate::authorize('restore', $olt);

        $olt = $this->oltService->restore($olt);

        return response()->json([
            'success' => true,
            'message' => 'OLT restored successfully.',
            'data' => new OltResource($olt),
        ]);
    }
    public function forceDelete(int $id): JsonResponse
    {
        $olt = $this->oltService->findTrashed($id);

        Gate::authorize('forceDelete', $olt);

        $this->oltService->forceDelete($olt);

        return response()->json([
            'success' => true,
            'message' => 'OLT permanently deleted successfully.',
        ]);
    }
}
