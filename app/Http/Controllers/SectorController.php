<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use Illuminate\Http\Request;

class SectorController extends Controller
{
    public function index()
    {
        return Sector::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'community_id' => 'required|exists:communities,id',
        ]);
        return Sector::create($validated);
    }

    public function show(string $id)
    {
        return Sector::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $sector = Sector::findOrFail($id);
        $sector->update($request->all());
        return $sector;
    }

    public function destroy(string $id)
    {
        Sector::destroy($id);
        return response()->noContent();
    }
}
