<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalFacility extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Relation to Type (ASIC, CDI, Custom)
    public function type()
    {
        return $this->belongsTo(MedicalFacilityType::class, 'medical_facility_type_id');
    }

    // Relation to Parent Facility (e.g. Ambulatorio belongs to ASIC)
    public function parent()
    {
        return $this->belongsTo(MedicalFacility::class, 'parent_id');
    }

    // Relation to Children Facilities (e.g. ASIC has many Ambulatorios)
    public function children()
    {
        return $this->hasMany(MedicalFacility::class, 'parent_id');
    }

    // Many-to-Many with Communities (Unified Pivot)
    public function communities()
    {
        return $this->belongsToMany(Community::class, 'community_medical_facility');
    }

    // Users working here (Polymorphic 'workplace')
    public function users()
    {
        return $this->morphMany(User::class, 'workplace');
    }
}
