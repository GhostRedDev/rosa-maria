<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Pivot table to link Communities to Facilities (Polymorphic)
        // A facility (ASIC/CDI/etc) can serve multiple communities.
        Schema::create('community_facility', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained()->onDelete('cascade');
            $table->morphs('facility'); // facility_id, facility_type
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_facility');
    }
};
