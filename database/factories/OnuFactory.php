<?php

namespace Database\Factories;

use App\Models\DistributionPoint;
use App\Models\Onu;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Onu>
 */
class OnuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['online', 'online', 'offline', 'los', 'disabled']);

        return [
            'distribution_point_id' => DistributionPoint::factory(),
            'serial_number' => Str::upper(fake()->unique()->bothify('ONU########')),
            'mac_address' => fake()->optional(0.9)->macAddress(),
            'vendor' => fake()->randomElement(['Huawei', 'ZTE', 'FiberHome', 'Nokia']),
            'model' => fake()->randomElement(['HG8245H', 'F660', 'AN5506-04-FG', 'G-140W-C']),
            'rx_power' => $status === 'disabled' ? null : fake()->randomFloat(2, -31.5, -15.5),
            'tx_power' => $status === 'disabled' ? null : fake()->randomFloat(2, 0.8, 3.5),
            'status' => $status,
            'last_seen_at' => $status === 'disabled' ? null : fake()->dateTimeBetween('-2 days', 'now'),
            'installed_at' => fake()->dateTimeBetween('-2 years', '-1 month'),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
