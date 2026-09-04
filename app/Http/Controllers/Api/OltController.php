<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OltResource;
use App\Models\Olt;
use App\Services\OltService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

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
}
