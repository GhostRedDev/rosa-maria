<?php

namespace App\Http\Controllers;

use App\Models\Community;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Community::all()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        return Community::create($validated);
    }

    public function show(string $id)
    {
        return Community::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $community = Community::findOrFail($id);
        $community->update($request->all());
        return $community;
    }

    public function destroy(string $id)
    {
        Community::destroy($id);
        return response()->noContent();
    }
}
