<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'splitter_id',
    'code',
    'name',
    'type',
    'total_ports',
    'used_ports',
    'location_name',
    'address',
    'latitude',
    'longitude',
    'description',
])]
class DistributionPoint extends Model
{
    use HasFactory;

    protected $attributes = [
        'total_ports' => 0,
        'used_ports' => 0,
    ];

    public function splitter(): BelongsTo
    {
        return $this->belongsTo(Splitter::class);
    }

    public function onus(): HasMany
    {
        return $this->hasMany(Onu::class);
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
            'splitter_id' => 'integer',
            'total_ports' => 'integer',
            'used_ports' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }
}
