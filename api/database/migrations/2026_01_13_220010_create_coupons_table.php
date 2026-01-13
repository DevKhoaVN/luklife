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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Mã giảm giá (VD: SALE50)
            $table->enum('type', ['fixed', 'percent'])->default('fixed'); // Loại giảm (tiền mặt hay %)
            $table->decimal('value', 10, 2); // Giá trị giảm
            $table->decimal('min_order_amount', 10, 2)->nullable(); // Đơn tối thiểu
            $table->integer('max_uses')->nullable(); // Số lượt dùng tối đa
            $table->integer('used_count')->default(0); // Đã dùng bao nhiêu lần
            $table->dateTime('starts_at')->nullable(); // Ngày bắt đầu
            $table->dateTime('expires_at')->nullable(); // Ngày hết hạn
            $table->boolean('is_active')->default(true); // Trạng thái
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
