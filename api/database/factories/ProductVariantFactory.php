<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // product_id sẽ được truyền từ Seeder vào
            'sku' => strtoupper(\Illuminate\Support\Str::random(10)),
            'color' => $this->faker->randomElement(['Đỏ', 'Xanh', 'Vàng', 'Đen', 'Trắng']),
            'size' => $this->faker->randomElement(['S', 'M', 'L', 'XL', 'XXL']),
            'sale_price' => $this->faker->numberBetween(100, 2000) * 1000,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'is_active' => 1,
        ];
    }
}
