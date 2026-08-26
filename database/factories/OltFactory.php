<?php

namespace Database\Factories;

use App\Models\Olt;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Olt>
 */
class OltFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $location = fake()->randomElement(['Banani', 'Mirpur', 'Uttara', 'Gulshan', 'Dhanmondi']);

        return [
            'name' => "{$location} POP OLT ".fake()->numberBetween(1, 9),
            'code' => Str::upper(fake()->unique()->bothify('OLT-???-###')),
            'vendor' => fake()->randomElement(['Huawei', 'ZTE', 'FiberHome', 'Nokia']),
            'model' => fake()->randomElement(['MA5800-X7', 'C320', 'AN5516-04', 'ISAM FX-8']),
            'ip_address' => fake()->ipv4(),
            'location_name' => "{$location} POP",
            'latitude' => fake()->latitude(23.7000000, 23.9000000),
            'longitude' => fake()->longitude(90.3300000, 90.4500000),
            'total_pon_ports' => fake()->randomElement([8, 16]),
            'status' => fake()->randomElement(['online', 'online', 'maintenance', 'offline']),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
