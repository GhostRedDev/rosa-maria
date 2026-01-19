<?php

namespace App\Http\Controllers;

use App\Models\Family;
use Illuminate\Http\Request;

class FamilyController extends Controller
{
    public function index()
    {
        return Family::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'house_id' => 'required|exists:houses,id',
        ]);
        return Family::create($validated);
    }

    public function show(string $id)
    {
        return Family::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $family = Family::findOrFail($id);
        $family->update($request->all());
        return $family;
    }

    public function destroy(string $id)
    {
        Family::destroy($id);
        return response()->noContent();
    }
}
