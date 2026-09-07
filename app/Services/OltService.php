<?php

namespace App\Services;

use App\Exceptions\CannotDeleteOltException;
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
                fn(Builder $query): Builder =>
                $query->where('status', $status)
            )
            ->latest('updated_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function show(Olt $olt): Olt
    {
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

        return $olt;
    }

    public function store(array $data): Olt
    {
        return Olt::create($data);
    }

    public function update(Olt $olt, array $data): Olt
    {
        $olt->update($data);

        return $olt->refresh();
    }

    public function destroy(Olt $olt): void
    {
        if ($olt->ponPorts()->exists()) {
            throw new CannotDeleteOltException(
                'OLT cannot be moved to trash because it has connected PON ports.'
            );
        }
        $olt->delete();
    }

    public function trashed(
        int $perPage = 10
    ): LengthAwarePaginator {
        return Olt::onlyTrashed()
            ->latest('deleted_at')
            ->paginate($perPage);
    }

    public function findTrashed(int $id): Olt
    {
        return Olt::onlyTrashed()
            ->findOrFail($id);
    }

    public function restore(Olt $olt): Olt
    {
        $olt->restore();

        return $olt->refresh();
    }

    public function forceDelete(Olt $olt): void
    {
        if ($olt->ponPorts()->exists()) {
            throw new CannotDeleteOltException(
                'OLT cannot be permanently deleted because it has connected PON ports.'
            );
        }
        $olt->forceDelete();
    }
}
