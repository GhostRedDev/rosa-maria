<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// API routes are handled in api.php, so we don't need to worry about them here.
// We want all "web" interactions to be handled by our React app.

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

