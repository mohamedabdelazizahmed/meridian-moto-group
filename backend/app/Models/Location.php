<?php

namespace App\Models;

use App\Enums\LocationType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'city',
        'address',
        'phone',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'type' => LocationType::class,
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }
}
