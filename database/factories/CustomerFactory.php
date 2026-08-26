<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $area = fake()->randomElement(['Banani', 'Mirpur', 'Uttara', 'Gulshan', 'Dhanmondi']);

        return [
            'customer_code' => Str::upper(fake()->unique()->bothify('CUS-???-####')),
            'name' => fake()->name(),
            'phone' => '+8801'.fake()->numerify('#########'),
            'email' => fake()->optional(0.85)->safeEmail(),
            'address' => fake()->streetAddress().", {$area}, Dhaka",
            'area' => $area,
            'latitude' => fake()->optional(0.85)->latitude(23.7000000, 23.9000000),
            'longitude' => fake()->optional(0.85)->longitude(90.3300000, 90.4500000),
            'status' => fake()->randomElement(['active', 'active', 'inactive']),
        ];
    }
}
