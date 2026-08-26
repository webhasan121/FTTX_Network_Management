<?php

namespace Database\Factories;

use App\Models\Connection;
use App\Models\Customer;
use App\Models\Onu;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Connection>
 */
class ConnectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['active', 'active', 'inactive', 'disconnected']);

        return [
            'customer_id' => Customer::factory(),
            'onu_id' => Onu::factory(),
            'connection_code' => Str::upper(fake()->unique()->bothify('CONN-???-####')),
            'status' => $status,
            'activated_at' => fake()->dateTimeBetween('-2 years', '-1 week'),
            'disconnected_at' => $status === 'disconnected' ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
