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
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('province_code')->nullable()->after('city');     // Mã tỉnh/thành (thay city_code cho chuẩn)
            $table->string('district_code')->nullable()->after('district');
            $table->string('ward_code')->nullable()->after('ward');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn([
                'province_code',
                'district_code',
                'ward_code',
            ]);
        });
    }
};
