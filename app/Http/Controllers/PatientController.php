<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        return Patient::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:M,F',
            'family_id' => 'required|exists:families,id',
        ]);
        return Patient::create($validated);
    }

    public function show(string $id)
    {
        return Patient::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->update($request->all());
        return $patient;
    }

    public function destroy(string $id)
    {
        Patient::destroy($id);
        return response()->noContent();
    }
}
