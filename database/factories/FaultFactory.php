<?php

namespace Database\Factories;

use App\Models\Fault;
use App\Models\Olt;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Fault>
 */
class FaultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['open', 'investigating', 'assigned', 'resolved', 'monitoring']);
        $reportedAt = fake()->dateTimeBetween('-7 days', 'now');

        return [
            'title' => fake()->randomElement([
                'LOS detected on customer segment',
                'High optical loss on PON branch',
                'OLT uplink alarm reported',
                'Distribution box power issue',
            ]),
            'fault_type' => fake()->randomElement(['los', 'high_rx_loss', 'fiber_cut', 'power', 'onu_flapping']),
            'severity' => fake()->randomElement(['critical', 'major', 'minor', 'warning']),
            'status' => $status,
            'olt_id' => Olt::factory(),
            'pon_port_id' => null,
            'distribution_point_id' => null,
            'onu_id' => null,
            'description' => fake()->sentence(),
            'assigned_to' => null,
            'reported_at' => $reportedAt,
            'resolved_at' => $status === 'resolved' ? fake()->dateTimeBetween($reportedAt, 'now') : null,
        ];
    }
}
