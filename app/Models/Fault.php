<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'title',
    'fault_type',
    'severity',
    'status',
    'olt_id',
    'pon_port_id',
    'distribution_point_id',
    'onu_id',
    'description',
    'assigned_to',
    'reported_at',
    'resolved_at',
])]
class Fault extends Model
{
    use HasFactory, SoftDeletes;

    protected $attributes = [
        'status' => 'open',
    ];

    public function olt(): BelongsTo
    {
        return $this->belongsTo(Olt::class);
    }

    public function ponPort(): BelongsTo
    {
        return $this->belongsTo(PonPort::class);
    }

    public function distributionPoint(): BelongsTo
    {
        return $this->belongsTo(DistributionPoint::class);
    }

    public function onu(): BelongsTo
    {
        return $this->belongsTo(Onu::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'olt_id' => 'integer',
            'pon_port_id' => 'integer',
            'distribution_point_id' => 'integer',
            'onu_id' => 'integer',
            'assigned_to' => 'integer',
            'reported_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }
}
