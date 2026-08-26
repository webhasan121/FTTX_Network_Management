<?php

namespace Database\Seeders;

use App\Models\Connection;
use App\Models\Customer;
use App\Models\Onu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ConnectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::where('status', 'active')
            ->orderBy('customer_code')
            ->limit(40)
            ->get()
            ->values();

        $onus = Onu::where('status', 'online')
            ->orderBy('serial_number')
            ->limit(40)
            ->get()
            ->values();

        $connectionCount = min(40, $customers->count(), $onus->count());

        for ($index = 0; $index < $connectionCount; $index++) {
            $number = $index + 1;
            $customer = $customers->get($index);
            $onu = $onus->get($index);
            $areaCode = Str::between($onu->serial_number, 'ONU-', '-');
            $connectionCode = sprintf('CONN-%s-%04d', $areaCode, $number);

            $attributes = [
                'customer_id' => $customer->id,
                'onu_id' => $onu->id,
                'connection_code' => $connectionCode,
                'status' => 'active',
                'activated_at' => now()->subMonths(1 + (($number * 2) % 18))->subDays($number % 20),
                'disconnected_at' => null,
                'notes' => "Active demo connection for {$customer->customer_code} using {$onu->serial_number}.",
            ];

            Connection::updateOrCreate(
                ['connection_code' => $connectionCode],
                Connection::factory()->raw($attributes),
            );
        }
    }
}
