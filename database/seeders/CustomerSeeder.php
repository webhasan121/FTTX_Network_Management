<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $names = [
            'Rahim Ahmed',
            'Nusrat Jahan',
            'Tanvir Hasan',
            'Farzana Akter',
            'Arif Chowdhury',
            'Sadia Rahman',
            'Imran Hossain',
            'Maliha Karim',
            'Sabbir Alam',
            'Samira Islam',
        ];

        $areas = [
            ['code' => 'BAN', 'name' => 'Banani', 'latitude' => 23.7940000, 'longitude' => 90.4060000],
            ['code' => 'MIR', 'name' => 'Mirpur', 'latitude' => 23.8060000, 'longitude' => 90.3680000],
            ['code' => 'UTR', 'name' => 'Uttara', 'latitude' => 23.8750000, 'longitude' => 90.3800000],
            ['code' => 'GUL', 'name' => 'Gulshan', 'latitude' => 23.7925000, 'longitude' => 90.4149000],
            ['code' => 'DHN', 'name' => 'Dhanmondi', 'latitude' => 23.7465000, 'longitude' => 90.3760000],
        ];

        for ($number = 1; $number <= 50; $number++) {
            $area = $areas[($number - 1) % count($areas)];
            $customerCode = sprintf('CUS-%s-%04d', $area['code'], $number);
            $name = $names[($number - 1) % count($names)];

            $attributes = [
                'customer_code' => $customerCode,
                'name' => "{$name} {$number}",
                'phone' => sprintf('+88017%08d', 12000000 + $number),
                'email' => sprintf('customer%02d@fttx.test', $number),
                'address' => sprintf(
                    'House %d, Road %d, %s, Dhaka',
                    10 + $number,
                    1 + ($number % 18),
                    $area['name'],
                ),
                'area' => $area['name'],
                'latitude' => round($area['latitude'] + (($number % 7) * 0.00043), 7),
                'longitude' => round($area['longitude'] + (($number % 6) * 0.00037), 7),
                'status' => $number > 40 && $number % 3 === 0 ? 'inactive' : 'active',
            ];

            Customer::updateOrCreate(
                ['customer_code' => $customerCode],
                Customer::factory()->raw($attributes),
            );
        }
    }
}
