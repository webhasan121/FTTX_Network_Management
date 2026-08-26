<?php

namespace Database\Seeders;

use App\Models\DistributionPoint;
use App\Models\Splitter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class DistributionPointSeeder extends Seeder
{
    public const DEMO_CODES = [
        'FDB-BAN-001',
        'FDB-BAN-002',
        'FDB-BAN-003',
        'FDB-BAN-004',
        'FDB-BAN-005',
        'FDB-BAN-006',
        'FDB-MIR-001',
        'FDB-MIR-002',
        'FDB-MIR-003',
        'FDB-MIR-004',
        'FDB-MIR-005',
        'FDB-UTR-001',
        'FDB-UTR-002',
        'FDB-UTR-003',
        'FDB-UTR-004',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $splitters = Splitter::whereIn('code', SplitterSeeder::DEMO_CODES)
            ->get()
            ->keyBy('code');

        $distributionPoints = [
            [
                'splitter_code' => 'SPL-BAN-001',
                'code' => 'FDB-BAN-001',
                'name' => 'Banani Road 11 FDB 01',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Banani Road 11, Lane 2',
                'address' => 'House 12, Road 11, Banani, Dhaka',
                'latitude' => 23.7949000,
                'longitude' => 90.4054000,
                'description' => 'Eight-port fiber distribution box for Road 11 customers.',
            ],
            [
                'splitter_code' => 'SPL-BAN-001',
                'code' => 'FDB-BAN-002',
                'name' => 'Banani Road 11 FDB 02',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Banani Road 11, Lane 4',
                'address' => 'House 28, Road 11, Banani, Dhaka',
                'latitude' => 23.7955000,
                'longitude' => 90.4049000,
                'description' => 'Secondary FDB on the Road 11 branch.',
            ],
            [
                'splitter_code' => 'SPL-BAN-002',
                'code' => 'FDB-BAN-003',
                'name' => 'Banani Block C FDB 01',
                'type' => 'fat',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Banani Block C, Road 7',
                'address' => 'Block C, Road 7, Banani, Dhaka',
                'latitude' => 23.7904000,
                'longitude' => 90.4088000,
                'description' => 'Fiber access terminal for Block C apartments.',
            ],
            [
                'splitter_code' => 'SPL-BAN-002',
                'code' => 'FDB-BAN-004',
                'name' => 'Banani Block C FDB 02',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Banani Block C, Road 9',
                'address' => 'Block C, Road 9, Banani, Dhaka',
                'latitude' => 23.7899000,
                'longitude' => 90.4096000,
                'description' => 'Compact distribution box for Block C customer drops.',
            ],
            [
                'splitter_code' => 'SPL-BAN-003',
                'code' => 'FDB-BAN-005',
                'name' => 'Banani Lakeside FDB',
                'type' => 'closure',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Banani Lakeside',
                'address' => 'Lakeside Road, Banani, Dhaka',
                'latitude' => 23.7971000,
                'longitude' => 90.4021000,
                'description' => 'Weatherproof closure feeding lakeside drops.',
            ],
            [
                'splitter_code' => 'SPL-BAN-004',
                'code' => 'FDB-BAN-006',
                'name' => 'Banani DOHS FDB',
                'type' => 'cabinet',
                'total_ports' => 12,
                'used_ports' => 4,
                'location_name' => 'Banani DOHS Gate 2',
                'address' => 'Gate 2, Banani DOHS, Dhaka',
                'latitude' => 23.8012000,
                'longitude' => 90.3981000,
                'description' => 'Outdoor cabinet for DOHS residential lanes.',
            ],
            [
                'splitter_code' => 'SPL-MIR-001',
                'code' => 'FDB-MIR-001',
                'name' => 'Mirpur 10 Circle FDB 01',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Mirpur 10 Circle North',
                'address' => 'North side, Mirpur 10 Circle, Dhaka',
                'latitude' => 23.8067000,
                'longitude' => 90.3693000,
                'description' => 'High-density customer distribution point near the circle.',
            ],
            [
                'splitter_code' => 'SPL-MIR-001',
                'code' => 'FDB-MIR-002',
                'name' => 'Mirpur 10 Circle FDB 02',
                'type' => 'fat',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Mirpur 10 Circle South',
                'address' => 'South side, Mirpur 10 Circle, Dhaka',
                'latitude' => 23.8056000,
                'longitude' => 90.3683000,
                'description' => 'Fiber terminal for south-side commercial buildings.',
            ],
            [
                'splitter_code' => 'SPL-MIR-002',
                'code' => 'FDB-MIR-003',
                'name' => 'Mirpur 11 Avenue FDB 01',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Mirpur 11 Avenue 5',
                'address' => 'Avenue 5, Mirpur 11, Dhaka',
                'latitude' => 23.8176000,
                'longitude' => 90.3660000,
                'description' => 'Distribution box for Avenue 5 customers.',
            ],
            [
                'splitter_code' => 'SPL-MIR-002',
                'code' => 'FDB-MIR-004',
                'name' => 'Mirpur 11 Avenue FDB 02',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Mirpur 11 Avenue 6',
                'address' => 'Avenue 6, Mirpur 11, Dhaka',
                'latitude' => 23.8182000,
                'longitude' => 90.3652000,
                'description' => 'Distribution box for Avenue 6 and adjacent lanes.',
            ],
            [
                'splitter_code' => 'SPL-MIR-003',
                'code' => 'FDB-MIR-005',
                'name' => 'Kazipara Main Road FDB',
                'type' => 'cabinet',
                'total_ports' => 12,
                'used_ports' => 4,
                'location_name' => 'Kazipara Main Road',
                'address' => 'Kazipara Main Road, Mirpur, Dhaka',
                'latitude' => 23.7989000,
                'longitude' => 90.3711000,
                'description' => 'Cabinet-mounted distribution point on Kazipara branch.',
            ],
            [
                'splitter_code' => 'SPL-UTR-001',
                'code' => 'FDB-UTR-001',
                'name' => 'Uttara Sector 7 FDB 01',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Uttara Sector 7, Road 3',
                'address' => 'Road 3, Sector 7, Uttara, Dhaka',
                'latitude' => 23.8744000,
                'longitude' => 90.3792000,
                'description' => 'Sector 7 residential distribution box.',
            ],
            [
                'splitter_code' => 'SPL-UTR-001',
                'code' => 'FDB-UTR-002',
                'name' => 'Uttara Sector 7 FDB 02',
                'type' => 'fat',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Uttara Sector 7, Road 5',
                'address' => 'Road 5, Sector 7, Uttara, Dhaka',
                'latitude' => 23.8751000,
                'longitude' => 90.3801000,
                'description' => 'Fiber terminal serving Sector 7 Road 5.',
            ],
            [
                'splitter_code' => 'SPL-UTR-002',
                'code' => 'FDB-UTR-003',
                'name' => 'Uttara Sector 9 FDB',
                'type' => 'fdb',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Uttara Sector 9',
                'address' => 'Road 8, Sector 9, Uttara, Dhaka',
                'latitude' => 23.8701000,
                'longitude' => 90.3857000,
                'description' => 'Sector 9 distribution box.',
            ],
            [
                'splitter_code' => 'SPL-UTR-003',
                'code' => 'FDB-UTR-004',
                'name' => 'Uttara Sector 13 FDB',
                'type' => 'closure',
                'total_ports' => 8,
                'used_ports' => 4,
                'location_name' => 'Uttara Sector 13',
                'address' => 'Road 12, Sector 13, Uttara, Dhaka',
                'latitude' => 23.8805000,
                'longitude' => 90.3898000,
                'description' => 'Small closure for Sector 13 customer pockets.',
            ],
        ];

        foreach ($distributionPoints as $distributionPointData) {
            $splitter = $splitters->get($distributionPointData['splitter_code']);

            if (! $splitter) {
                continue;
            }

            $attributes = Arr::except($distributionPointData, ['splitter_code']);
            $attributes['splitter_id'] = $splitter->id;

            DistributionPoint::updateOrCreate(
                ['code' => $attributes['code']],
                DistributionPoint::factory()->raw($attributes),
            );
        }
    }
}
