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
        Schema::create('shippings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('carrier_name', 100);
            $table->string('tracking_code', 100)->nullable();
            $table->decimal('shipping_cost', 15, 2);
            $table->enum('current_status', ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'])->default('pending');
            $table->string('carrier_ref_id', 100)->nullable();
            $table->timestamp('shipped_date')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index('order_id', 'idx_order_id');
            $table->index('tracking_code', 'idx_tracking_code');
            $table->index('current_status', 'idx_current_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shippings');
    }
};
