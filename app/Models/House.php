<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function street()
    {
        return $this->belongsTo(Street::class);
    }

    public function families()
    {
        return $this->hasMany(Family::class);
    }
}
