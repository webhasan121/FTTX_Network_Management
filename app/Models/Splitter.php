<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
#[Fillable([
    'pon_port_id',
    'code',
    'name',
    'ratio',
    'total_ports',
    'used_ports',
    'location_name',
    'latitude',
    'longitude',
    'description',
])]
class Splitter extends Model
{
    use HasFactory, SoftDeletes;

    protected $attributes = [
        'total_ports' => 0,
        'used_ports' => 0,
    ];

    public function ponPort(): BelongsTo
    {
        return $this->belongsTo(PonPort::class);
    }

    public function distributionPoints(): HasMany
    {
        return $this->hasMany(DistributionPoint::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pon_port_id' => 'integer',
            'total_ports' => 'integer',
            'used_ports' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }
}
