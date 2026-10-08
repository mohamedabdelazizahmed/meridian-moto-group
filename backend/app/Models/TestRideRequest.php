<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestRideRequest extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'motorcycle_id',
        'name',
        'phone',
        'email',
        'preferred_date',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Motorcycle, $this>
     */
    public function motorcycle(): BelongsTo
    {
        return $this->belongsTo(Motorcycle::class);
    }
}
