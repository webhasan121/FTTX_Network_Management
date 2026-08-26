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
        Schema::create('faults', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('fault_type')->index();
            $table->string('severity')->index();
            $table->string('status')->default('open')->index();
            $table->foreignId('olt_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('pon_port_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('distribution_point_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('onu_id')->nullable()->constrained('onus')->nullOnDelete();
            $table->text('description')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reported_at')->nullable()->index();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faults');
    }
};
