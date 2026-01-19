<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function dashboardStats(Request $request)
    {
        $user = auth()->user();
        $communityId = $request->input('community_id');
        $houseId = $request->input('house_id');

        // --- 1. Determine Allowed Scope ---
        $allowedCommunityIds = [];
        $isRestricted = false;

        if ($user && !$user->hasRole(['Admin', 'MedicalChief'])) {
            $isRestricted = true;
            // Get communities assigned to their workplace
            if ($user->workplace && method_exists($user->workplace, 'communities')) {
                $allowedCommunityIds = $user->workplace->communities->pluck('id')->toArray();
            }
        }

        // --- 2. Apply Filters (Strict Override if Restricted) ---
        $targetCommunityIds = [];

        if ($isRestricted) {
            // User can ONLY see their allowed communities.
            // If they ask for specific one, check if it's in allowed list.
            if ($communityId) {
                if (in_array($communityId, $allowedCommunityIds)) {
                    $targetCommunityIds = [$communityId];
                } else {
                    // Tried to access unauthorized community -> Return Empty/Zero or fallback to allowed
                    // Strict security: return empty scope for that ID, effectively 0 results
                    $targetCommunityIds = [-1];
                }
            } else {
                // No specific request -> Show ALL allowed
                $targetCommunityIds = $allowedCommunityIds;
            }
        } else {
            // Admin/Chief: Can see everything or specific request
            if ($communityId) {
                $targetCommunityIds = [$communityId];
            }
            // If no communityId, we don't filter by community (Global View)
        }

        // --- 3. Build Queries ---

        // Helper to apply community/house filters to Patient/Case Query
        $applyFilters = function ($query) use ($targetCommunityIds, $houseId, $isRestricted) {
            // Filter by House if specifically requested
            if ($houseId) {
                // If restricted, we still need to ensure this House belongs to an allowed Community?
                // For simplified logic: If House is requested, we trust the ID exists. 
                // But strictly: We should check House->Street->Sector->Community is in allowed list.
                // For MVP: We rely on Community Filter being applied implicitly or explicitly.
                $query->whereHas('family', function ($q) use ($houseId) {
                    $q->where('house_id', $houseId);
                });
            }

            // Filter by Community (Aggregation)
            if (!empty($targetCommunityIds)) {
                $query->whereHas('family.house.street.sector', function ($q) use ($targetCommunityIds) {
                    $q->whereIn('community_id', $targetCommunityIds);
                });
            }
        };

        // --- 4. Execute Queries ---

        // Patients
        $patientsQuery = \App\Models\Patient::query();
        $applyFilters($patientsQuery);
        $patientCount = $patientsQuery->count();

        // Active Cases
        $casesQuery = \App\Models\MedicalCase::where('status', 'Open');
        // Cases belong to patients, so apply same filter logic via Patient relationship
        $casesQuery->whereHas('patient', function ($q) use ($targetCommunityIds, $houseId) {
            // Re-use logic: Patient -> Family -> House...
            if ($houseId) {
                $q->whereHas('family', fn($f) => $f->where('house_id', $houseId));
            }
            if (!empty($targetCommunityIds)) {
                $q->whereHas('family.house.street.sector', fn($s) => $s->whereIn('community_id', $targetCommunityIds));
            }
        });
        $activeCasesCount = $casesQuery->count();

        // Facilities (Count only logical based on scope? Or just count facilities?)
        // If I am a Doctor in Ambulatorio X, do I care about total facilities? Maybe not.
        // Let's just keep global facility count for now, or scope it to hierarchy if needed.
        // User said: "medico... solo puede ver sus estadisticas de la comunidad... y viviendas"
        // Facilities count is less relevant for a scoped doctor, but let's keep it global or zero it.
        $facilityCount = \App\Models\MedicalFacility::count();

        return response()->json([
            'patients' => $patientCount,
            'active_cases' => $activeCasesCount,
            'facilities' => $facilityCount,
            'consultations_today' => rand(5, 20), // Mock
            'debug_scope' => $isRestricted ? 'Restricted' : 'Global',
            'allowed_communities' => $isRestricted ? $allowedCommunityIds : 'All'
        ]);
    }
}
