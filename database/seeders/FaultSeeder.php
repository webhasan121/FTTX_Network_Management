<?php

namespace Database\Seeders;

use App\Models\DistributionPoint;
use App\Models\Fault;
use App\Models\Olt;
use App\Models\Onu;
use App\Models\PonPort;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class FaultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assignedUserId = User::where('email', 'admin@fttx.test')->first()?->id
            ?? User::orderBy('id')->first()?->id;

        $faults = [
            [
                'title' => 'Critical LOS on FDB-BAN-002 feeder',
                'fault_type' => 'fiber_cut',
                'severity' => 'critical',
                'status' => 'open',
                'olt_code' => 'OLT-BAN-001',
                'pon_port_number' => 1,
                'distribution_point_code' => 'FDB-BAN-002',
                'onu_serial_number' => null,
                'description' => 'Multiple ONUs behind FDB-BAN-002 stopped responding after feeder attenuation spike.',
                'reported_hours_ago' => 2,
                'resolved_hours_after_report' => null,
            ],
            [
                'title' => 'High Rx loss for ONU-BAN-0007',
                'fault_type' => 'high_rx_loss',
                'severity' => 'major',
                'status' => 'investigating',
                'olt_code' => 'OLT-BAN-001',
                'pon_port_number' => 1,
                'distribution_point_code' => 'FDB-BAN-002',
                'onu_serial_number' => 'ONU-BAN-0007',
                'description' => 'Rx power is near threshold and requires field inspection at the customer drop.',
                'reported_hours_ago' => 6,
                'resolved_hours_after_report' => null,
            ],
            [
                'title' => 'PON-02 utilization warning on OLT-BAN-001',
                'fault_type' => 'capacity',
                'severity' => 'warning',
                'status' => 'monitoring',
                'olt_code' => 'OLT-BAN-001',
                'pon_port_number' => 2,
                'distribution_point_code' => null,
                'onu_serial_number' => null,
                'description' => 'Peak-hour PON utilization crossed planning threshold for two consecutive evenings.',
                'reported_hours_ago' => 18,
                'resolved_hours_after_report' => null,
            ],
            [
                'title' => 'OLT-MIR-001 uplink packet loss',
                'fault_type' => 'uplink',
                'severity' => 'major',
                'status' => 'assigned',
                'olt_code' => 'OLT-MIR-001',
                'pon_port_number' => null,
                'distribution_point_code' => null,
                'onu_serial_number' => null,
                'description' => 'NOC observed intermittent packet loss on the Mirpur POP uplink.',
                'reported_hours_ago' => 10,
                'resolved_hours_after_report' => null,
            ],
            [
                'title' => 'Power interruption at FDB-MIR-005',
                'fault_type' => 'power',
                'severity' => 'critical',
                'status' => 'open',
                'olt_code' => 'OLT-MIR-001',
                'pon_port_number' => 3,
                'distribution_point_code' => 'FDB-MIR-005',
                'onu_serial_number' => 'ONU-MIR-0043',
                'description' => 'ONU group reported offline after a suspected local power interruption near Kazipara.',
                'reported_hours_ago' => 3,
                'resolved_hours_after_report' => null,
            ],
            [
                'title' => 'LOS alarm on ONU-UTR-0053',
                'fault_type' => 'los',
                'severity' => 'critical',
                'status' => 'investigating',
                'olt_code' => 'OLT-UTR-001',
                'pon_port_number' => 2,
                'distribution_point_code' => 'FDB-UTR-003',
                'onu_serial_number' => 'ONU-UTR-0053',
                'description' => 'Single ONU is reporting LOS and has not recovered after remote reset.',
                'reported_hours_ago' => 1,
                'resolved_hours_after_report' => null,
            ],
            [
                'title' => 'Planned maintenance follow-up for OLT-UTR-001',
                'fault_type' => 'maintenance',
                'severity' => 'minor',
                'status' => 'resolved',
                'olt_code' => 'OLT-UTR-001',
                'pon_port_number' => 8,
                'distribution_point_code' => null,
                'onu_serial_number' => null,
                'description' => 'Maintenance window completed and disabled expansion port verified.',
                'reported_hours_ago' => 72,
                'resolved_hours_after_report' => 4,
            ],
            [
                'title' => 'Disabled ONU audit required for ONU-UTR-0058',
                'fault_type' => 'inventory',
                'severity' => 'minor',
                'status' => 'assigned',
                'olt_code' => 'OLT-UTR-001',
                'pon_port_number' => 3,
                'distribution_point_code' => 'FDB-UTR-004',
                'onu_serial_number' => 'ONU-UTR-0058',
                'description' => 'Disabled ONU remains assigned to a drop and should be audited before reuse.',
                'reported_hours_ago' => 24,
                'resolved_hours_after_report' => null,
            ],
        ];

        foreach ($faults as $faultData) {
            $attributes = Arr::except($faultData, [
                'olt_code',
                'pon_port_number',
                'distribution_point_code',
                'onu_serial_number',
                'reported_hours_ago',
                'resolved_hours_after_report',
            ]);

            $reportedAt = now()->subHours($faultData['reported_hours_ago']);

            $attributes['olt_id'] = $this->oltId($faultData['olt_code']);
            $attributes['pon_port_id'] = $this->ponPortId(
                $faultData['olt_code'],
                $faultData['pon_port_number'],
            );
            $attributes['distribution_point_id'] = $this->distributionPointId($faultData['distribution_point_code']);
            $attributes['onu_id'] = $this->onuId($faultData['onu_serial_number']);
            $attributes['assigned_to'] = $assignedUserId;
            $attributes['reported_at'] = $reportedAt;
            $attributes['resolved_at'] = $faultData['resolved_hours_after_report']
                ? $reportedAt->copy()->addHours($faultData['resolved_hours_after_report'])
                : null;

            Fault::updateOrCreate(
                ['title' => $attributes['title']],
                Fault::factory()->raw($attributes),
            );
        }
    }

    private function oltId(?string $code): ?int
    {
        if (! $code) {
            return null;
        }

        return Olt::where('code', $code)->first()?->id;
    }

    private function ponPortId(?string $oltCode, ?int $portNumber): ?int
    {
        if (! $oltCode || ! $portNumber) {
            return null;
        }

        return PonPort::where('port_number', $portNumber)
            ->whereHas('olt', function (Builder $query) use ($oltCode): void {
                $query->where('code', $oltCode);
            })
            ->first()?->id;
    }

    private function distributionPointId(?string $code): ?int
    {
        if (! $code) {
            return null;
        }

        return DistributionPoint::where('code', $code)->first()?->id;
    }

    private function onuId(?string $serialNumber): ?int
    {
        if (! $serialNumber) {
            return null;
        }

        return Onu::where('serial_number', $serialNumber)->first()?->id;
    }
}
