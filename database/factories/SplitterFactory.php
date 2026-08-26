<?php

namespace Database\Factories;

use App\Models\PonPort;
use App\Models\Splitter;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Splitter>
 */
class SplitterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ratio = fake()->randomElement(['1:8', '1:16', '1:32']);

        return [
            'pon_port_id' => PonPort::factory(),
            'code' => Str::upper(fake()->unique()->bothify('SPL-???-###')),
            'name' => fake()->streetName().' Splitter',
            'ratio' => $ratio,
            'total_ports' => (int) Str::after($ratio, ':'),
            'used_ports' => fake()->numberBetween(0, (int) Str::after($ratio, ':')),
            'location_name' => fake()->streetName(),
            'latitude' => fake()->latitude(23.7000000, 23.9000000),
            'longitude' => fake()->longitude(90.3300000, 90.4500000),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
