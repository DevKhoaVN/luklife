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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('recipient_name');
            $table->string('recipient_phone', 20);
            $table->string('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('ward', 100)->nullable();
            $table->string('district', 100);
            $table->string('city', 100);
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->default('Vietnam');
            $table->boolean('is_default')->default(false);
            $table->enum('address_type', ['home', 'office', 'other'])->default('home');
            $table->timestamps();

            $table->index('user_id', 'idx_user_id');
            $table->index(['user_id', 'is_default'], 'idx_is_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
