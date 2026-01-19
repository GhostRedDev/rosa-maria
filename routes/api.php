<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\StreetController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\FamilyController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedicalCaseController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\RoleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('api')->group(function () {
    Route::apiResource('communities', CommunityController::class);
    Route::apiResource('sectors', SectorController::class);
    Route::apiResource('streets', StreetController::class);
    Route::apiResource('houses', HouseController::class);
    Route::apiResource('families', FamilyController::class);
    Route::apiResource('patients', PatientController::class);
    Route::apiResource('medical-cases', MedicalCaseController::class);
    Route::apiResource('facilities', FacilityController::class);
    Route::apiResource('personnel', PersonnelController::class);
    Route::apiResource('inventory', InventoryController::class);
    Route::apiResource('roles', RoleController::class);
    Route::get('/dashboard-stats', [App\Http\Controllers\StatisticsController::class, 'dashboardStats']);
    Route::apiResource('medical-facility-types', App\Http\Controllers\MedicalFacilityTypeController::class);
});
