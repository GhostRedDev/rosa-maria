<?php

namespace App\Http\Controllers;

use App\Models\House;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function index()
    {
        return House::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|string|max:255',
            'street_id' => 'required|exists:streets,id',
        ]);
        return House::create($validated);
    }

    public function show(string $id)
    {
        return House::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $house = House::findOrFail($id);
        $house->update($request->all());
        return $house;
    }

    public function destroy(string $id)
    {
        House::destroy($id);
        return response()->noContent();
    }
}
