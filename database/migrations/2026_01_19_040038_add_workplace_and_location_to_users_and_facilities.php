<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->nullableMorphs('workplace'); // Adds workplace_id and workplace_type
        });

        $facilities = ['asics', 'cdis', 'ambulatorios', 'napis'];
        foreach ($facilities as $facility) {
            Schema::table($facility, function (Blueprint $table) {
                $table->decimal('latitude', 10, 8)->nullable();
                $table->decimal('longitude', 10, 8)->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropMorphs('workplace');
        });

        $facilities = ['asics', 'cdis', 'ambulatorios', 'napis'];
        foreach ($facilities as $facility) {
            Schema::table($facility, function (Blueprint $table) {
                $table->dropColumn(['latitude', 'longitude']);
            });
        }
    }
};
