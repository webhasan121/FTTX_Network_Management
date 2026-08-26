<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NetworkDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            OltSeeder::class,
            PonPortSeeder::class,
            SplitterSeeder::class,
            DistributionPointSeeder::class,
            OnuSeeder::class,
            CustomerSeeder::class,
            ConnectionSeeder::class,
            FaultSeeder::class,
        ]);
    }
}
