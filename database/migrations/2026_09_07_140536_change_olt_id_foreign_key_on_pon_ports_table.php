<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pon_ports', function (Blueprint $table) {
            $table->dropForeign(['olt_id']);

            $table->foreign('olt_id')
                ->references('id')
                ->on('olts')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pon_ports', function (Blueprint $table) {
            $table->dropForeign(['olt_id']);

            $table->foreign('olt_id')
                ->references('id')
                ->on('olts')
                ->cascadeOnDelete();
        });
    }
};
