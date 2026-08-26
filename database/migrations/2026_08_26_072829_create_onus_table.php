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
        Schema::create('onus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_point_id')->nullable()->constrained()->nullOnDelete();
            $table->string('serial_number')->unique();
            $table->string('mac_address')->nullable()->index();
            $table->string('vendor');
            $table->string('model');
            $table->decimal('rx_power', 8, 2)->nullable();
            $table->decimal('tx_power', 8, 2)->nullable();
            $table->enum('status', ['online', 'offline', 'los', 'disabled'])->default('offline')->index();
            $table->timestamp('last_seen_at')->nullable()->index();
            $table->timestamp('installed_at')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onus');
    }
};
