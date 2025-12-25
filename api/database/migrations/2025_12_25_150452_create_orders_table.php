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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 50)->unique();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->onDelete('cascade');
            $table->foreignId('shipping_address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->string('recipient_name');
            $table->string('recipient_phone', 20);
            $table->text('shipping_address');
            $table->decimal('total_amount', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('shipping_fee', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2);
            $table->enum('order_status', ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'returned'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'pending', 'paid', 'failed', 'refunded'])->default('unpaid');
            $table->enum('payment_method', ['cod', 'vnpay'])->default('cod');
            $table->text('notes')->nullable();
            $table->text('cancelled_reason')->nullable();
            $table->timestamps();

            $table->index('order_code', 'idx_order_code');
            $table->index('user_id', 'idx_user_id');
            $table->index('order_status', 'idx_order_status');
            $table->index('payment_status', 'idx_payment_status');
            $table->index('created_at', 'idx_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
