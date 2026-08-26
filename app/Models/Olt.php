<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'code',
    'vendor',
    'model',
    'ip_address',
    'location_name',
    'latitude',
    'longitude',
    'total_pon_ports',
    'status',
    'description',
])]
class Olt extends Model
{
    use HasFactory;

    protected $attributes = [
        'total_pon_ports' => 0,
        'status' => 'offline',
    ];

    public function ponPorts(): HasMany
    {
        return $this->hasMany(PonPort::class);
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
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'total_pon_ports' => 'integer',
        ];
    }
}
