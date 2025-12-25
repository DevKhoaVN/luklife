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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('transaction_code', 100)->unique();
            $table->enum('payment_method', ['cod', 'vnpay']);
            $table->decimal('transaction_amount', 15, 2);
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->string('processor', 100)->nullable()->comment('payment gateway name');
            $table->text('processor_response')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('processed_at')->nullable();

            $table->index('order_id', 'idx_order_id');
            $table->index('transaction_code', 'idx_transaction_code');
            $table->index('status', 'idx_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
