<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambulatorio extends Model
{
    protected $guarded = [];

    public function communities()
    {
        return $this->morphToMany(Community::class, 'facility', 'community_facility');
    }

    public function users()
    {
        return $this->morphMany(User::class, 'workplace');
    }
}
