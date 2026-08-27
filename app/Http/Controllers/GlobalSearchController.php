<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\DistributionPoint;
use App\Models\Olt;
use App\Models\Onu;
use App\Models\PonPort;
use App\Models\Splitter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('q', ''));

        if (mb_strlen($search) < 2) {
            return response()->json([
                'results' => [],
            ]);
        }

        $like = '%' . $search . '%';

        $results = collect();

        /*
        |--------------------------------------------------------------------------
        | OLT
        |--------------------------------------------------------------------------
        */
        $olts = Olt::query()
            ->where(function ($query) use ($like) {
                $query
                    ->where('name', 'like', $like)
                    ->orWhere('code', 'like', $like)
                    ->orWhere('vendor', 'like', $like)
                    ->orWhere('model', 'like', $like)
                    ->orWhere('ip_address', 'like', $like)
                    ->orWhere('location_name', 'like', $like);
            })
            ->limit(3)
            ->get();

        foreach ($olts as $olt) {
            $results->push([
                'id' => 'olt-' . $olt->id,
                'type' => 'olt',
                'type_label' => 'OLT',
                'title' => $olt->name,
                'subtitle' => collect([
                    $olt->code,
                    $olt->vendor,
                    $olt->model,
                    $olt->ip_address,
                ])->filter()->implode(' • '),
                'status' => $olt->status,
                'url' => route('olts.show', $olt->id),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | PON Ports
        |--------------------------------------------------------------------------
        */
        $ponPorts = PonPort::query()
            ->with('olt:id,name,code')
            ->where(function ($query) use ($like) {
                $query
                    ->where('name', 'like', $like)
                    ->orWhere('port_number', 'like', $like)
                    ->orWhereHas('olt', function ($oltQuery) use ($like) {
                        $oltQuery
                            ->where('name', 'like', $like)
                            ->orWhere('code', 'like', $like);
                    });
            })
            ->limit(3)
            ->get();

        foreach ($ponPorts as $pon) {
            $results->push([
                'id' => 'pon-' . $pon->id,
                'type' => 'pon',
                'type_label' => 'PON Port',
                'title' => $pon->name,
                'subtitle' => collect([
                    $pon->olt?->code,
                    $pon->olt?->name,
                    $pon->port_number
                        ? 'Port ' . $pon->port_number
                        : null,
                ])->filter()->implode(' • '),
                'status' => $pon->status,
                'url' => route('pon-ports.show', $pon->id),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Splitters
        |--------------------------------------------------------------------------
        */
        $splitters = Splitter::query()
            ->with('ponPort.olt:id,name,code')
            ->where(function ($query) use ($like) {
                $query
                    ->where('name', 'like', $like)
                    ->orWhere('code', 'like', $like)
                    ->orWhere('ratio', 'like', $like)
                    ->orWhere('location_name', 'like', $like)
                    ->orWhereHas('ponPort', function ($ponQuery) use ($like) {
                        $ponQuery
                            ->where('name', 'like', $like)
                            ->orWhere('port_number', 'like', $like);
                    });
            })
            ->limit(3)
            ->get();

        foreach ($splitters as $splitter) {
            $results->push([
                'id' => 'splitter-' . $splitter->id,
                'type' => 'splitter',
                'type_label' => 'Splitter',
                'title' => $splitter->name,
                'subtitle' => collect([
                    $splitter->code,
                    $splitter->ratio,
                    $splitter->ponPort?->name,
                    $splitter->location_name,
                ])->filter()->implode(' • '),
                'status' => null,
                'url' => route('splitters.show', $splitter->id),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Distribution Points
        |--------------------------------------------------------------------------
        */
        $distributionPoints = DistributionPoint::query()
            ->where(function ($query) use ($like) {
                $query
                    ->where('name', 'like', $like)
                    ->orWhere('code', 'like', $like)
                    ->orWhere('type', 'like', $like)
                    ->orWhere('location_name', 'like', $like)
                    ->orWhere('address', 'like', $like);
            })
            ->limit(3)
            ->get();

        foreach ($distributionPoints as $point) {
            $results->push([
                'id' => 'distribution-' . $point->id,
                'type' => 'distribution',
                'type_label' => strtoupper($point->type ?? 'Distribution'),
                'title' => $point->name,
                'subtitle' => collect([
                    $point->code,
                    $point->location_name,
                    $point->address,
                ])->filter()->implode(' • '),
                'status' => null,
                'url' => route(
                    'distribution-points.show',
                    $point->id
                ),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | ONU / ONT
        |--------------------------------------------------------------------------
        */
        $onus = Onu::query()
            ->with('distributionPoint:id,name,code')
            ->where(function ($query) use ($like) {
                $query
                    ->where('serial_number', 'like', $like)
                    ->orWhere('mac_address', 'like', $like)
                    ->orWhere('vendor', 'like', $like)
                    ->orWhere('model', 'like', $like)
                    ->orWhereHas(
                        'distributionPoint',
                        function ($pointQuery) use ($like) {
                            $pointQuery
                                ->where('name', 'like', $like)
                                ->orWhere('code', 'like', $like);
                        }
                    );
            })
            ->limit(5)
            ->get();

        foreach ($onus as $onu) {
            $results->push([
                'id' => 'onu-' . $onu->id,
                'type' => 'onu',
                'type_label' => 'ONU / ONT',
                'title' => $onu->serial_number,
                'subtitle' => collect([
                    $onu->vendor,
                    $onu->model,
                    $onu->distributionPoint?->code,
                    $onu->rx_power !== null
                        ? 'RX ' . $onu->rx_power . ' dBm'
                        : null,
                ])->filter()->implode(' • '),
                'status' => $onu->status,
                'url' => route('onu-ont.show', $onu->id),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Customers
        |--------------------------------------------------------------------------
        */
        $customers = Customer::query()
            ->where(function ($query) use ($like) {
                $query
                    ->where('customer_code', 'like', $like)
                    ->orWhere('name', 'like', $like)
                    ->orWhere('phone', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('area', 'like', $like)
                    ->orWhere('address', 'like', $like);
            })
            ->limit(5)
            ->get();

        foreach ($customers as $customer) {
            $results->push([
                'id' => 'customer-' . $customer->id,
                'type' => 'customer',
                'type_label' => 'Customer',
                'title' => $customer->name,
                'subtitle' => collect([
                    $customer->customer_code,
                    $customer->phone,
                    $customer->area,
                ])->filter()->implode(' • '),
                'status' => $customer->status,
                'url' => route('customers.show', $customer->id),
            ]);
        }

        return response()->json([
            'results' => $results->values(),
        ]);
    }
}
