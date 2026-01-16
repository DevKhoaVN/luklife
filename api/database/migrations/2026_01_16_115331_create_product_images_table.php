<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            // Cột này để biết ảnh này thuộc về sản phẩm nào (ID sản phẩm)
            // onDelete('cascade') nghĩa là nếu xóa sản phẩm, ảnh cũng tự mất theo.
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            // Cột chứa đường dẫn file ảnh (ví dụ: uploads/products/anh1.jpg)
            $table->string('image_url');

            // Cột xác định thứ tự ảnh (ảnh nào hiện trước, ảnh nào hiện sau)
            $table->integer('position')->default(0);

            // Đánh dấu đây có phải ảnh đại diện chính không (1 là có, 0 là không)
            $table->boolean('is_thumbnail')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
