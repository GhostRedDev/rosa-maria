<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function sectors()
    {
        return $this->hasMany(Sector::class);
    }
}
