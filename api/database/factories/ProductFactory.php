<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\products;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductFactory extends Factory
{
    protected $model = products::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true); // Tên sản phẩm 3 từ
        $price = $this->faker->numberBetween(100, 2000) * 1000; // Giá chẵn (100k - 2tr)

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . rand(1000, 9999),
            'price' => $price,
            'discount_percentage' => $this->faker->numberBetween(0, 30),
            'description' => $this->faker->paragraph,
            'is_active' => 1,
            'is_featured' => $this->faker->boolean(20), // 20% cơ hội là SP nổi bật
            'thumbnail' => 'https://placehold.co/600x400?text=' . urlencode($name),
        ];
    }
}
