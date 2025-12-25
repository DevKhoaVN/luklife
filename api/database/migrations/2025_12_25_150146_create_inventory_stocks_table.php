<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('cascade');
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade');
            $table->integer('current_stock')->default(0);
            $table->integer('reserved_stock')->default(0);
            $table->timestamp('last_updated')->useCurrent()->useCurrentOnUpdate();

            $table->unique(['variant_id', 'warehouse_id'], 'unique_variant_warehouse');
            $table->index('variant_id', 'idx_variant_id');
            $table->index('warehouse_id', 'idx_warehouse_id');
        });
        DB::statement('ALTER TABLE inventory_stocks ADD COLUMN available_stock INT GENERATED ALWAYS AS (current_stock - reserved_stock) STORED');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_stocks');
    }
};
