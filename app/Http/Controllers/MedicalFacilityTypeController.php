<?php

namespace App\Http\Controllers;

use App\Models\MedicalFacilityType;
use Illuminate\Http\Request;

class MedicalFacilityTypeController extends Controller
{
    public function index()
    {
        return response()->json(['data' => MedicalFacilityType::all()]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:medical_facility_types,name']);
        $type = MedicalFacilityType::create($request->all());
        return response()->json(['data' => $type], 201);
    }

    public function destroy($id)
    {
        MedicalFacilityType::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
