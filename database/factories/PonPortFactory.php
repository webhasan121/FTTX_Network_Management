<?php

namespace Database\Factories;

use App\Models\Olt;
use App\Models\PonPort;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PonPort>
 */
class PonPortFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $portNumber = fake()->numberBetween(1, 16);

        return [
            'olt_id' => Olt::factory(),
            'name' => 'PON-'.str_pad((string) $portNumber, 2, '0', STR_PAD_LEFT),
            'port_number' => $portNumber,
            'capacity' => fake()->randomElement([64, 128]),
            'status' => fake()->randomElement(['active', 'active', 'disabled']),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
