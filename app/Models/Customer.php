<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_code',
    'name',
    'phone',
    'email',
    'address',
    'area',
    'latitude',
    'longitude',
    'status',
])]
class Customer extends Model
{
    use HasFactory;

    protected $attributes = [
        'status' => 'active',
    ];

    public function connections(): HasMany
    {
        return $this->hasMany(Connection::class);
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
        ];
    }
}
