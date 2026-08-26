<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();

            // General
            $table->string('application_name')
                ->default('FTTX Network Manager');

            $table->string('company_name')
                ->nullable();

            $table->string('support_email')
                ->nullable();

            $table->string('support_phone', 30)
                ->nullable();

            $table->string('timezone')
                ->default('Asia/Dhaka');

            // Network Monitoring
            $table->decimal(
                'onu_warning_rx_power',
                5,
                2
            )->default(-25.00);

            $table->decimal(
                'onu_critical_rx_power',
                5,
                2
            )->default(-28.00);

            $table->unsignedInteger(
                'onu_offline_timeout'
            )->default(5);

            $table->unsignedTinyInteger(
                'pon_utilization_warning'
            )->default(80);

            // Fault Management
            $table->enum(
                'default_fault_severity',
                [
                    'low',
                    'medium',
                    'high',
                    'critical',
                ]
            )->default('medium');

            $table->foreignId(
                'default_fault_assignee_id'
            )
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->boolean(
                'auto_resolve_faults'
            )->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'system_settings'
        );
    }
};
