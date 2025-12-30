<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kiểm tra xem ID 1 có chưa, chưa có thì mới tạo
        if (!\App\Models\categories::where('id', 1)->exists()) {
            \App\Models\categories::create([
                'id' => 1,
                'name' => 'Thời trang nam',
                'slug' => 'thoi-trang-nam',
                'is_active' => 1
            ]);
        }
    }
}
