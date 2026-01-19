<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalFacilityType extends Model
{
    protected $guarded = [];

    public function facilities()
    {
        return $this->hasMany(MedicalFacility::class);
    }
}
