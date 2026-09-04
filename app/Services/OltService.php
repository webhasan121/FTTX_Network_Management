<?php

namespace App\Services;

use App\Models\Olt;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class OltService
{
    public function paginate(
        string $search = '',
        string $status = '',
        int $perPage = 10
    ): LengthAwarePaginator {
        return Olt::query()
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
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(
                        function (Builder $query) use ($search): void {
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
                                ->orWhere(
                                    'vendor',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'model',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'ip_address',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'location_name',
                                    'like',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->when(
                $status !== '',
                fn (Builder $query): Builder =>
                    $query->where('status', $status)
            )
            ->latest('updated_at')
            ->paginate($perPage)
            ->withQueryString();
    }
}
