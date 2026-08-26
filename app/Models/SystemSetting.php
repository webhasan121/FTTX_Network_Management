<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemSetting extends Model
{
    protected $fillable = [
        'application_name',
        'company_name',
        'support_email',
        'support_phone',
        'timezone',

        'onu_warning_rx_power',
        'onu_critical_rx_power',
        'onu_offline_timeout',
        'pon_utilization_warning',

        'default_fault_severity',
        'default_fault_assignee_id',
        'auto_resolve_faults',
    ];

    protected function casts(): array
    {
        return [
            'onu_warning_rx_power' => 'decimal:2',
            'onu_critical_rx_power' => 'decimal:2',
            'onu_offline_timeout' => 'integer',
            'pon_utilization_warning' => 'integer',

            'default_fault_assignee_id' => 'integer',
            'auto_resolve_faults' => 'boolean',
        ];
    }

    public function defaultFaultAssignee(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'default_fault_assignee_id'
        );
    }
}
