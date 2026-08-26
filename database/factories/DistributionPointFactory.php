<?php

namespace Database\Factories;

use App\Models\DistributionPoint;
use App\Models\Splitter;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<DistributionPoint>
 */
class DistributionPointFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalPorts = fake()->randomElement([8, 12, 16]);

        return [
            'splitter_id' => Splitter::factory(),
            'code' => Str::upper(fake()->unique()->bothify('FDB-???-###')),
            'name' => fake()->streetName().' Fiber Box',
            'type' => fake()->randomElement(['fdb', 'fat', 'closure', 'cabinet']),
            'total_ports' => $totalPorts,
            'used_ports' => fake()->numberBetween(0, $totalPorts),
            'location_name' => fake()->streetName(),
            'address' => fake()->address(),
            'latitude' => fake()->latitude(23.7000000, 23.9000000),
            'longitude' => fake()->longitude(90.3300000, 90.4500000),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
