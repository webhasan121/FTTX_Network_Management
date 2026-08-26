<?php

namespace Database\Seeders;

use App\Models\Olt;
use App\Models\PonPort;
use Illuminate\Database\Seeder;

class PonPortSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $olts = Olt::whereIn('code', OltSeeder::DEMO_CODES)
            ->orderBy('code')
            ->get()
            ->keyBy('code');

        foreach (OltSeeder::DEMO_CODES as $oltCode) {
            $olt = $olts->get($oltCode);

            if (! $olt) {
                continue;
            }

            for ($portNumber = 1; $portNumber <= 8; $portNumber++) {
                $isExpansionPort = $oltCode === 'OLT-UTR-001' && $portNumber === 8;

                $attributes = [
                    'olt_id' => $olt->id,
                    'name' => 'PON-'.str_pad((string) $portNumber, 2, '0', STR_PAD_LEFT),
                    'port_number' => $portNumber,
                    'capacity' => 128,
                    'status' => $isExpansionPort ? 'disabled' : 'active',
                    'description' => $isExpansionPort
                        ? 'Reserved for future feeder expansion.'
                        : "Production PON port {$portNumber} on {$olt->code}.",
                ];

                PonPort::updateOrCreate(
                    [
                        'olt_id' => $olt->id,
                        'port_number' => $portNumber,
                    ],
                    PonPort::factory()->raw($attributes),
                );
            }
        }
    }
}
