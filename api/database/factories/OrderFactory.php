<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_code' => 'ORD' . strtoupper(\Illuminate\Support\Str::random(12)),
            // user_id và shipping_address_id sẽ được xử lý ở Seeder
            'recipient_name' => $this->faker->name,
            'recipient_phone' => $this->faker->phoneNumber,
            'shipping_address' => $this->faker->address,
            'total_amount' => 0, // Sẽ tính lại sau khi có OrderItem
            'grand_total' => 0,
            'order_status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'payment_status' => $this->faker->randomElement(['unpaid', 'paid']),
            'payment_method' => $this->faker->randomElement(['cod', 'vnpay', 'momo']),
        ];
    }
}
