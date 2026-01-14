<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // user_id truyền từ ngoài vào
            'recipient_name' => $this->faker->name,
            'recipient_phone' => $this->faker->phoneNumber,
            'address_line1' => $this->faker->streetAddress,
            'ward' => 'Phường ' . $this->faker->numberBetween(1, 20),
            'district' => $this->faker->citySuffix,
            'city' => $this->faker->city,
            'country' => 'Vietnam',
            'is_default' => 1,
            'address_type' => 'home',
        ];
    }
}
