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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('sku', 100)->unique();
            $table->string('color', 50)->nullable();
            $table->string('size', 50)->nullable();
            $table->decimal('price', 15, 2);
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->string('image_url')->nullable();
            $table->decimal('weight', 10, 2)->nullable()->comment('in grams');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('product_id', 'idx_product_id');
            $table->index('sku', 'idx_sku');
            $table->index('price', 'idx_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
