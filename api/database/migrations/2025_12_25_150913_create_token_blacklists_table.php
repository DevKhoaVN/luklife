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
        Schema::create('token_blacklists', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();

            // ✅ LƯU HASH (SHA-256)
            $table->char('token_hash', 64)->unique();

            $table->enum('token_type', ['access', 'refresh'])->default('access');

            $table->timestamp('expires_at');
            $table->timestamp('revoked_at')->nullable();

            $table->string('reason')->nullable()
                ->comment('logout, security, manual_revoke');

            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();

            // Index phục vụ query
            $table->index(['user_id', 'expires_at'], 'idx_user_expires');
            $table->index('expires_at', 'idx_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('token_blacklists');
    }
};
