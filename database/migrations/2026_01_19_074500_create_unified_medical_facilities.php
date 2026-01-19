<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // 1. Create Types Table (for "Modelos de Sitio Medico")
        Schema::create('medical_facility_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // ASIC, CDI, Ambulatorio, Farmacia Popular, etc.
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Seed default types
        DB::table('medical_facility_types')->insert([
            ['name' => 'ASIC', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'CDI', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ambulatorio', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'NAPI', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'CPT', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 2. Create Unified Facilities Table
        Schema::create('medical_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('medical_facility_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('medical_facilities')->onDelete('set null'); // For assigning to an ASIC
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 10, 8)->nullable();
            $table->timestamps();
        });

        // 3. Re-create Pivot (for Communities) - simpler now
        Schema::dropIfExists('community_facility'); // Drop old polymorphic one
        Schema::create('community_medical_facility', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained()->onDelete('cascade');
            $table->foreignId('medical_facility_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // 4. Update Users (polymorphic workplace was okay, but unified is easier)
        // We can keep polymorphic 'workplace_id'/'workplace_type' on users table, 
        // OR changing it to just 'medical_facility_id' nullable. 
        // Let's Keep polymorphic for flexibility (maybe work at a Pharmacy later?), 
        // but for now they will point to App\Models\MedicalFacility.
    }

    public function down(): void
    {
        Schema::dropIfExists('community_medical_facility');
        Schema::dropIfExists('medical_facilities');
        Schema::dropIfExists('medical_facility_types');
    }
};
