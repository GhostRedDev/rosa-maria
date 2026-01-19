<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Street extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function houses()
    {
        return $this->hasMany(House::class);
    }
}
