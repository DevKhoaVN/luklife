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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('item_discount', 15, 2)->default(0);
            $table->decimal('sub_total', 15, 2);
            $table->timestamp('created_at')->useCurrent();

            $table->index('order_id', 'idx_order_id');
            $table->index('variant_id', 'idx_variant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
