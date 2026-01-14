<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\users as User;
use App\Models\categories as Category;
use App\Models\products as Product;
use App\Models\product_variants as ProductVariant;
use App\Models\orders as Order;
use App\Models\order_items as OrderItem;
use App\Models\user_addresses as Address;
use App\Models\product_categories as ProductCategory;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo 50 User giả
        $users = User::factory(50)->create();

        // Mỗi User tạo cho họ 1 địa chỉ mặc định
        foreach ($users as $user) {
            Address::factory()->create(['user_id' => $user->id]);
        }

        // 2. Tạo 20 Danh mục
        $categories = Category::factory(20)->create();

        // 3. Tạo 100 Sản phẩm
        $products = Product::factory(100)->create();

        // Với mỗi sản phẩm, thực hiện các việc sau:
        foreach ($products as $product) {
            // a. Gắn vào 1-2 danh mục ngẫu nhiên
            $randomCategories = $categories->random(rand(1, 2));
            foreach ($randomCategories as $category) {
                DB::table('product_categories')->insert([
                    'product_id' => $product->id,
                    'category_id' => $category->id,
                ]);
            }

            // b. Tạo 3 biến thể (Variants) cho sản phẩm này (Ví dụ: Size S, M, L)
            ProductVariant::factory(3)->create([
                'product_id' => $product->id,
                'sale_price' => $product->price // Giá biến thể bằng giá gốc
            ]);
        }

        // 4. Tạo 50 Đơn hàng ngẫu nhiên
        // Lấy tất cả biến thể sản phẩm để random mua
        $allVariants = ProductVariant::all();

        for ($i = 0; $i < 50; $i++) {
            // Chọn bừa 1 user
            $randomUser = $users->random();
            $address = Address::where('user_id', $randomUser->id)->first();

            // Tạo khung đơn hàng
            $order = Order::factory()->create([
                'user_id' => $randomUser->id,
                'shipping_address_id' => $address->id,
            ]);

            $totalAmount = 0;

            // Mỗi đơn hàng mua ngẫu nhiên 1-5 sản phẩm
            $randomVariants = $allVariants->random(rand(1, 5));

            foreach ($randomVariants as $variant) {
                $qty = rand(1, 3);
                $subTotal = $variant->sale_price * $qty;

                OrderItem::create([
                    'order_id' => $order->id,
                    'variant_id' => $variant->id,
                    'quantity' => $qty,
                    'unit_price' => $variant->sale_price,
                    'sub_total' => $subTotal
                ]);

                $totalAmount += $subTotal;
            }

            // Cập nhật lại tổng tiền đơn hàng
            $order->update([
                'total_amount' => $totalAmount,
                'grand_total' => $totalAmount + 30000 // Cộng 30k ship
            ]);
        }
    }
}
