<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'distribution_point_id',
    'serial_number',
    'mac_address',
    'vendor',
    'model',
    'rx_power',
    'tx_power',
    'status',
    'last_seen_at',
    'installed_at',
    'description',
])]
class Onu extends Model
{
    use HasFactory, SoftDeletes;

    protected $attributes = [
        'status' => 'offline',
    ];

    public function distributionPoint(): BelongsTo
    {
        return $this->belongsTo(DistributionPoint::class);
    }

    public function connection(): HasOne
    {
        return $this->hasOne(Connection::class);
    }

    public function faults(): HasMany
    {
        return $this->hasMany(Fault::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'distribution_point_id' => 'integer',
            'rx_power' => 'decimal:2',
            'tx_power' => 'decimal:2',
            'last_seen_at' => 'datetime',
            'installed_at' => 'datetime',
        ];
    }
}
