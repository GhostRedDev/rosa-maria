<?php

namespace App\Http\Controllers;

use App\Models\Street;
use Illuminate\Http\Request;

class StreetController extends Controller
{
    public function index()
    {
        return Street::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sector_id' => 'required|exists:sectors,id',
        ]);
        return Street::create($validated);
    }

    public function show(string $id)
    {
        return Street::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $street = Street::findOrFail($id);
        $street->update($request->all());
        return $street;
    }

    public function destroy(string $id)
    {
        Street::destroy($id);
        return response()->noContent();
    }
}
