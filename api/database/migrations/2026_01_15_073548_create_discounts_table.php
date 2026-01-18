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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Mã giảm giá
            $table->string('name'); // Tên chương trình
            $table->text('description')->nullable(); // Mô tả

            // Loại giảm giá: percentage (%), fixed (số tiền cố định)
            $table->enum('type', ['percentage', 'fixed'])->default('percentage');

            // Giá trị giảm giá
            $table->decimal('value', 10, 2)->default(0);

            // Giá trị đơn hàng tối thiểu để áp dụng
            $table->decimal('min_order_value', 10, 2)->default(0);

            // Giá trị giảm tối đa (cho loại percentage)
            $table->decimal('max_discount_value', 10, 2)->nullable();
            $table->integer('used_count')->default(0);
            // Thời gian hiệu lực
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();

            // Trạng thái
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index('code');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
