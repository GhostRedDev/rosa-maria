<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalFacilityType;
use App\Models\MedicalFacility;
use App\Models\User;
use App\Models\Community;
use App\Models\Patient;
use App\Models\MedicalCase;
use App\Models\Pharmacy;
use App\Models\Inventory;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Ensure Roles exist
        $this->call(GuacaraSeeder::class); // Reuse community hierarchy logic
        $this->ensureRoles();

        // 1. Create Facility Types
        $types = ['ASIC', 'CDI', 'Ambulatorio', 'Hospital', 'NAPI'];
        $typeModels = [];
        foreach ($types as $t) {
            $typeModels[$t] = MedicalFacilityType::firstOrCreate(['name' => $t]);
        }

        // 2. Create Facilities (Hierarchical)
        // ASIC Guacara (Parent)
        $asic = MedicalFacility::firstOrCreate(
            ['name' => 'ASIC Guacara Central'],
            [
                'medical_facility_type_id' => $typeModels['ASIC']->id,
                'latitude' => 10.2289,
                'longitude' => -67.8767
            ]
        );

        // Assign Communities to ASIC (All of GuacaraSeeder)
        $communities = Community::all();
        $asic->communities()->syncWithoutDetaching($communities->pluck('id'));

        // Create Medical Chief for ASIC
        $chief = User::firstOrCreate(
            ['email' => 'jefe@guacara.com'],
            ['name' => 'Dr. Jefe Guacara', 'password' => Hash::make('password')]
        );
        $chief->assignRole('MedicalChief');
        $chief->workplace()->associate($asic);
        $chief->save();

        // 3. Create Child Facilities (Ambulatorios) assigned to ASIC
        $ambulatoriosData = [
            ['name' => 'Ambulatorio Yagua', 'type' => 'Ambulatorio', 'lat' => 10.2500, 'lon' => -67.8800],
            ['name' => 'CDI Ciudad Alianza', 'type' => 'CDI', 'lat' => 10.2100, 'lon' => -67.8500],
            ['name' => 'NAPI Vigirima', 'type' => 'NAPI', 'lat' => 10.2800, 'lon' => -67.8900],
        ];

        foreach ($ambulatoriosData as $facData) {
            $fac = MedicalFacility::firstOrCreate(
                ['name' => $facData['name']],
                [
                    'medical_facility_type_id' => $typeModels[$facData['type']]->id,
                    'parent_id' => $asic->id,
                    'latitude' => $facData['lat'],
                    'longitude' => $facData['lon']
                ]
            );

            // Assign scoped communities (e.g. Yagua ambulatorio gets Yagua community)
            $relevantComms = $communities->filter(fn($c) => str_contains($facData['name'], $c->name));
            if ($relevantComms->isNotEmpty()) {
                $fac->communities()->syncWithoutDetaching($relevantComms->pluck('id'));
            } else {
                // Fallback: assign random community
                $fac->communities()->syncWithoutDetaching([$communities->random()->id]);
            }

            // Create Doctor for this Facility
            $doc = User::firstOrCreate(
                ['email' => 'doc.' . strtolower(str_replace(' ', '', $facData['name'])) . '@guacara.com'],
                ['name' => 'Dr. ' . $fac->name, 'password' => Hash::make('password')]
            );
            $doc->assignRole('Doctor');
            $doc->workplace()->associate($fac);
            $doc->save();

            // 4. Create Pharmacy & Inventory
            $pharmacy = Pharmacy::firstOrCreate(
                ['name' => 'Farmacia ' . $fac->name],
                [
                    'facility_id' => $fac->id,
                    'facility_type' => 'App\Models\MedicalFacility'
                ]
            );
            // If Pharmacy migration failed or assumes old IDs, this might error. 
            // I'll assume standard direct ID or I'll skip if complex. 
            // *Wait*, Pharmacy likely uses `facility_id` pointing to `medical_facilities`.

            Inventory::firstOrCreate(['item_name' => 'Paracetamol 500mg', 'pharmacy_id' => $pharmacy->id], ['quantity' => 100, 'type' => 'Medicine']);
            Inventory::firstOrCreate(['item_name' => 'Alcohol', 'pharmacy_id' => $pharmacy->id], ['quantity' => 20, 'type' => 'Supply']);
        }

        // 5. Create Medical Cases & Stats
        $patients = Patient::all();
        $statuses = ['Open', 'Closed', 'Critical', 'Recovery'];
        $faker = \Faker\Factory::create();

        foreach ($patients as $index => $patient) {
            // Create a case for 30% of patients
            if ($index % 3 === 0) {
                MedicalCase::firstOrCreate(
                    ['title' => 'Caso Médico #' . ($index + 1), 'patient_id' => $patient->id],
                    [
                        'description' => 'Paciente presenta síntomas de ' . $faker->randomElement(['Gripe', 'Dengue', 'Hipertensión']),
                        'status' => $faker->randomElement($statuses),
                    ]
                );
            }
        }
    }

    private function ensureRoles()
    {
        $roles = ['Admin', 'MedicalChief', 'Doctor', 'Staff'];
        foreach ($roles as $r) {
            Role::firstOrCreate(['name' => $r, 'guard_name' => 'web']);
        }
    }
}
