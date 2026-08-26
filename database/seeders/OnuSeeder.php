<?php

namespace Database\Seeders;

use App\Models\DistributionPoint;
use App\Models\Onu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class OnuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $distributionPoints = DistributionPoint::whereIn('code', DistributionPointSeeder::DEMO_CODES)
            ->orderBy('code')
            ->get()
            ->values();

        if ($distributionPoints->isEmpty()) {
            return;
        }

        for ($number = 1; $number <= 60; $number++) {
            $distributionPoint = $distributionPoints->get(intdiv($number - 1, 4));
            $areaCode = $this->areaCode($distributionPoint);
            $status = $this->statusForNumber($number);
            $serialNumber = sprintf('ONU-%s-%04d', $areaCode, $number);

            $attributes = [
                'distribution_point_id' => $distributionPoint->id,
                'serial_number' => $serialNumber,
                'mac_address' => $this->macAddress($number),
                'vendor' => $this->vendorForNumber($number),
                'model' => $this->modelForNumber($number),
                'rx_power' => $this->rxPowerForStatus($status, $number),
                'tx_power' => $this->txPowerForStatus($status, $number),
                'status' => $status,
                'last_seen_at' => $this->lastSeenAtForStatus($status, $number),
                'installed_at' => now()->subMonths(2 + (($number * 3) % 24))->subDays($number % 28),
                'description' => "Demo ONU connected through {$distributionPoint->code}.",
            ];

            Onu::updateOrCreate(
                ['serial_number' => $serialNumber],
                Onu::factory()->raw($attributes),
            );
        }
    }

    private function areaCode(DistributionPoint $distributionPoint): string
    {
        return Str::between($distributionPoint->code, 'FDB-', '-');
    }

    private function macAddress(int $number): string
    {
        return sprintf(
            '00:1A:79:%02X:%02X:%02X',
            intdiv($number, 256),
            $number % 256,
            ($number * 7) % 256,
        );
    }

    private function vendorForNumber(int $number): string
    {
        return ['Huawei', 'ZTE', 'FiberHome', 'Nokia'][$number % 4];
    }

    private function modelForNumber(int $number): string
    {
        return ['HG8245H', 'F660', 'AN5506-04-FG', 'G-140W-C'][$number % 4];
    }

    private function statusForNumber(int $number): string
    {
        if ($number <= 42) {
            return 'online';
        }

        if ($number <= 52) {
            return 'offline';
        }

        if ($number <= 57) {
            return 'los';
        }

        return 'disabled';
    }

    private function rxPowerForStatus(string $status, int $number): ?float
    {
        return match ($status) {
            'online' => round(-17.4 - (($number % 10) * 0.74), 2),
            'offline' => round(-27.8 - (($number % 6) * 0.55), 2),
            'los' => round(-33.2 - (($number % 5) * 0.71), 2),
            default => null,
        };
    }

    private function txPowerForStatus(string $status, int $number): ?float
    {
        return match ($status) {
            'online' => round(1.12 + (($number % 6) * 0.23), 2),
            'offline' => round(0.72 + (($number % 5) * 0.18), 2),
            'los' => round(0.38 + (($number % 4) * 0.15), 2),
            default => null,
        };
    }

    private function lastSeenAtForStatus(string $status, int $number): ?Carbon
    {
        return match ($status) {
            'online' => now()->subMinutes(($number * 7) % 180),
            'offline' => now()->subHours(4 + ($number % 36)),
            'los' => now()->subMinutes(35 + ($number % 120)),
            default => null,
        };
    }
}
