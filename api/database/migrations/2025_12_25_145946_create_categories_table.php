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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('trending')->default(false);
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->integer('level')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('slug', 'idx_slug');
            $table->index('parent_id', 'idx_parent_id');
            $table->index(['trending', 'is_active'], 'idx_trending');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
