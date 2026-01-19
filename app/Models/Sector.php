<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function streets()
    {
        return $this->hasMany(Street::class);
    }
}
