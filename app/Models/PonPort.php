<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'olt_id',
    'name',
    'port_number',
    'capacity',
    'status',
    'description',
])]
class PonPort extends Model
{
    use HasFactory;

    protected $attributes = [
        'capacity' => 128,
        'status' => 'active',
    ];

    public function olt(): BelongsTo
    {
        return $this->belongsTo(Olt::class);
    }

    public function splitters(): HasMany
    {
        return $this->hasMany(Splitter::class);
    }

    public function faults(): HasMany
    {
        return $this->hasMany(Fault::class);
    }

    protected function casts(): array
    {
        return [
            'olt_id' => 'integer',
            'port_number' => 'integer',
            'capacity' => 'integer',
        ];
    }
}
