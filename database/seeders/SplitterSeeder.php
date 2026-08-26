<?php

namespace Database\Seeders;

use App\Models\PonPort;
use App\Models\Splitter;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class SplitterSeeder extends Seeder
{
    public const DEMO_CODES = [
        'SPL-BAN-001',
        'SPL-BAN-002',
        'SPL-BAN-003',
        'SPL-BAN-004',
        'SPL-MIR-001',
        'SPL-MIR-002',
        'SPL-MIR-003',
        'SPL-UTR-001',
        'SPL-UTR-002',
        'SPL-UTR-003',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ponPorts = PonPort::with('olt')->get();

        $splitters = [
            [
                'olt_code' => 'OLT-BAN-001',
                'pon_port_number' => 1,
                'code' => 'SPL-BAN-001',
                'name' => 'Banani Road 11 Primary Splitter',
                'ratio' => '1:16',
                'total_ports' => 16,
                'used_ports' => 10,
                'location_name' => 'Banani Road 11',
                'latitude' => 23.7945000,
                'longitude' => 90.4058000,
                'description' => 'Primary feeder splitter for Banani Road 11 homes.',
            ],
            [
                'olt_code' => 'OLT-BAN-001',
                'pon_port_number' => 2,
                'code' => 'SPL-BAN-002',
                'name' => 'Banani Block C Splitter',
                'ratio' => '1:16',
                'total_ports' => 16,
                'used_ports' => 8,
                'location_name' => 'Banani Block C',
                'latitude' => 23.7909000,
                'longitude' => 90.4091000,
                'description' => 'Serves Block C apartment clusters.',
            ],
            [
                'olt_code' => 'OLT-BAN-001',
                'pon_port_number' => 3,
                'code' => 'SPL-BAN-003',
                'name' => 'Banani Lakeside Splitter',
                'ratio' => '1:8',
                'total_ports' => 8,
                'used_ports' => 5,
                'location_name' => 'Banani Lakeside',
                'latitude' => 23.7976000,
                'longitude' => 90.4027000,
                'description' => 'Low-density lakeside customer segment.',
            ],
            [
                'olt_code' => 'OLT-BAN-001',
                'pon_port_number' => 4,
                'code' => 'SPL-BAN-004',
                'name' => 'Banani DOHS Splitter',
                'ratio' => '1:16',
                'total_ports' => 16,
                'used_ports' => 9,
                'location_name' => 'Banani DOHS Gate 2',
                'latitude' => 23.8017000,
                'longitude' => 90.3985000,
                'description' => 'Splitter feeding DOHS residential lanes.',
            ],
            [
                'olt_code' => 'OLT-MIR-001',
                'pon_port_number' => 1,
                'code' => 'SPL-MIR-001',
                'name' => 'Mirpur 10 Circle Splitter',
                'ratio' => '1:16',
                'total_ports' => 16,
                'used_ports' => 12,
                'location_name' => 'Mirpur 10 Circle',
                'latitude' => 23.8062000,
                'longitude' => 90.3689000,
                'description' => 'High-utilization splitter near Mirpur 10 Circle.',
            ],
            [
                'olt_code' => 'OLT-MIR-001',
                'pon_port_number' => 2,
                'code' => 'SPL-MIR-002',
                'name' => 'Mirpur 11 Avenue Splitter',
                'ratio' => '1:16',
                'total_ports' => 16,
                'used_ports' => 10,
                'location_name' => 'Mirpur 11 Avenue 5',
                'latitude' => 23.8179000,
                'longitude' => 90.3665000,
                'description' => 'Residential splitter for Avenue 5 and adjacent lanes.',
            ],
            [
                'olt_code' => 'OLT-MIR-001',
                'pon_port_number' => 3,
                'code' => 'SPL-MIR-003',
                'name' => 'Kazipara Splitter',
                'ratio' => '1:8',
                'total_ports' => 8,
                'used_ports' => 6,
                'location_name' => 'Kazipara Main Road',
                'latitude' => 23.7993000,
                'longitude' => 90.3715000,
                'description' => 'Splitter serving Kazipara roadside customers.',
            ],
            [
                'olt_code' => 'OLT-UTR-001',
                'pon_port_number' => 1,
                'code' => 'SPL-UTR-001',
                'name' => 'Uttara Sector 7 Splitter',
                'ratio' => '1:16',
                'total_ports' => 16,
                'used_ports' => 7,
                'location_name' => 'Uttara Sector 7',
                'latitude' => 23.8749000,
                'longitude' => 90.3798000,
                'description' => 'Sector 7 feeder splitter.',
            ],
            [
                'olt_code' => 'OLT-UTR-001',
                'pon_port_number' => 2,
                'code' => 'SPL-UTR-002',
                'name' => 'Uttara Sector 9 Splitter',
                'ratio' => '1:16',
                'total_ports' => 16,
                'used_ports' => 9,
                'location_name' => 'Uttara Sector 9',
                'latitude' => 23.8706000,
                'longitude' => 90.3862000,
                'description' => 'Sector 9 access splitter.',
            ],
            [
                'olt_code' => 'OLT-UTR-001',
                'pon_port_number' => 3,
                'code' => 'SPL-UTR-003',
                'name' => 'Uttara Sector 13 Splitter',
                'ratio' => '1:8',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Uttara Sector 13',
                'latitude' => 23.8809000,
                'longitude' => 90.3903000,
                'description' => 'Small splitter for Sector 13 customer pockets.',
            ],
        ];

        foreach ($splitters as $splitterData) {
            $ponPort = $this->findPonPort(
                $ponPorts,
                $splitterData['olt_code'],
                $splitterData['pon_port_number'],
            );

            if (! $ponPort) {
                continue;
            }

            $attributes = Arr::except($splitterData, ['olt_code', 'pon_port_number']);
            $attributes['pon_port_id'] = $ponPort->id;

            Splitter::updateOrCreate(
                ['code' => $attributes['code']],
                Splitter::factory()->raw($attributes),
            );
        }
    }

    /**
     * @param  Collection<int, PonPort>  $ponPorts
     */
    private function findPonPort(Collection $ponPorts, string $oltCode, int $portNumber): ?PonPort
    {
        return $ponPorts->first(function (PonPort $ponPort) use ($oltCode, $portNumber): bool {
            return $ponPort->olt?->code === $oltCode
                && $ponPort->port_number === $portNumber;
        });
    }
}
