<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $query = \App\Models\MedicalFacility::with(['type', 'parent', 'communities']);

        // Scope: If staff, only show own workplace OR facilities under their ASIC if they are Chief
        if ($user && !$user->hasRole(['Admin', 'MedicalChief'])) {
            if ($user->workplace_type === \App\Models\MedicalFacility::class && $user->workplace_id) {
                // Show their own facility
                // Ideally, if they area chief of an ASIC, they should see children.
                // Let's implement: If workplace is ASIC, show children too?
                // For now, strict workplace scope as requested: "solo podran ver su sitio de trabajo"
                $query->where('id', $user->workplace_id);
            } else {
                return response()->json(['data' => []]);
            }
        }

        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'medical_facility_type_id' => 'required|exists:medical_facility_types,id',
            'parent_id' => 'nullable|exists:medical_facilities,id', // For assigning Ambulatorio -> ASIC
            'community_ids' => 'array',
            'latitude' => 'nullable',
            'longitude' => 'nullable',
            'create_user' => 'boolean',
            'user_email' => 'nullable|email|unique:users,email'
        ]);

        $facility = \App\Models\MedicalFacility::create($request->only([
            'name',
            'medical_facility_type_id',
            'parent_id',
            'latitude',
            'longitude'
        ]));

        if ($request->has('community_ids')) {
            $facility->communities()->sync($request->community_ids);
        }

        if ($request->create_user && $request->user_email) {
            $user = \App\Models\User::create([
                'name' => $facility->name . ' Admin',
                'email' => $request->user_email,
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]);

            // Assign Workplace (Polymorphic Unified)
            $user->workplace()->associate($facility);
            $user->save();

            // Assign Role - default to Doctor or custom role
            $user->assignRole('Doctor');
        }

        return response()->json(['message' => 'Facility created successfully', 'data' => $facility], 201);
    }
}
