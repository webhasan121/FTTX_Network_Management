<?php

namespace Database\Seeders;

use App\Models\Olt;
use Illuminate\Database\Seeder;

class OltSeeder extends Seeder
{
    public const DEMO_CODES = [
        'OLT-BAN-001',
        'OLT-MIR-001',
        'OLT-UTR-001',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $olts = [
            [
                'name' => 'Banani Central POP OLT',
                'code' => 'OLT-BAN-001',
                'vendor' => 'Huawei',
                'model' => 'MA5800-X7',
                'ip_address' => '10.10.1.2',
                'location_name' => 'Banani Central POP',
                'latitude' => 23.7939000,
                'longitude' => 90.4066000,
                'total_pon_ports' => 8,
                'status' => 'online',
                'description' => 'Primary OLT serving Banani FTTX distribution zones.',
            ],
            [
                'name' => 'Mirpur Metro POP OLT',
                'code' => 'OLT-MIR-001',
                'vendor' => 'ZTE',
                'model' => 'C320',
                'ip_address' => '10.10.2.2',
                'location_name' => 'Mirpur Metro POP',
                'latitude' => 23.8069000,
                'longitude' => 90.3687000,
                'total_pon_ports' => 8,
                'status' => 'online',
                'description' => 'Metro aggregation OLT for Mirpur residential coverage.',
            ],
            [
                'name' => 'Uttara Sector POP OLT',
                'code' => 'OLT-UTR-001',
                'vendor' => 'FiberHome',
                'model' => 'AN5516-04',
                'ip_address' => '10.10.3.2',
                'location_name' => 'Uttara Sector POP',
                'latitude' => 23.8759000,
                'longitude' => 90.3795000,
                'total_pon_ports' => 8,
                'status' => 'maintenance',
                'description' => 'Uttara OLT with one PON kept disabled for planned expansion.',
            ],
        ];

        foreach ($olts as $oltData) {
            Olt::updateOrCreate(
                ['code' => $oltData['code']],
                Olt::factory()->raw($oltData),
            );
        }
    }
}
