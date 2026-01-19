<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Community;
use App\Models\Sector;
use App\Models\Street;
use App\Models\House;
use App\Models\Family;
use App\Models\Patient;

class GuacaraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Communities (Comunas / Parroquias / Areas Mayores)
        $communities = [
            ['name' => 'Ciudad Alianza', 'description' => 'Urbanización Ciudad Alianza y alrededores'],
            ['name' => 'Yagua', 'description' => 'Parroquia Yagua'],
            ['name' => 'El Samán', 'description' => 'Sector El Samán y zonas aledañas'],
            ['name' => 'Aragüita', 'description' => 'Zona sur de Guacara'],
            ['name' => 'Casco Central', 'description' => 'Centro de Guacara'],
            ['name' => 'Vigirima', 'description' => 'Zona norte de Guacara'],
        ];

        foreach ($communities as $commData) {
            $community = Community::firstOrCreate($commData);

            // 2. Sectors for each Community
            $sectors = [];
            if ($community->name === 'Ciudad Alianza') {
                $sectors = ['1ra Etapa', '2da Etapa', '3ra Etapa', '4ta Etapa', '5ta Etapa', 'El Toquito'];
            } elseif ($community->name === 'Yagua') {
                $sectors = ['El Cabrito', 'Maracaibito', 'El Perrote', 'Quebrada Honda'];
            } elseif ($community->name === 'El Samán') {
                $sectors = ['Sector A', 'Sector B', 'Sector C', 'La Floresta'];
            } elseif ($community->name === 'Aragüita') {
                $sectors = ['La Libertad', 'Dios Todopoderoso', 'Tricentenario', 'La Juventud'];
            } elseif ($community->name === 'Casco Central') {
                $sectors = ['La Coromoto', 'La Florida', 'San Rafael', 'Loma Linda'];
            } elseif ($community->name === 'Vigirima') {
                $sectors = ['El Toco', 'Ojo de Agua', 'Cacho Mocho'];
            }

            foreach ($sectors as $index => $sectorName) {
                $sector = Sector::create([
                    'name' => $sectorName,
                    'community_id' => $community->id,
                ]);

                // 3. Create dummy streets for first sector of each community
                if ($index === 0) {
                    $streets = ['Calle Principal', 'Calle 1', 'Calle 2', 'Avenida Bolívar'];
                    foreach ($streets as $streetName) {
                        $street = Street::create([
                            'name' => $streetName,
                            'sector_id' => $sector->id,
                        ]);

                        // 4. Create dummy houses
                        for ($i = 1; $i <= 5; $i++) {
                            $house = House::create([
                                'number' => $sectorName[0] . '-' . $i . '0', // e.g., 1-10
                                'street_id' => $street->id,
                            ]);

                            // 5. Create Families
                            $faker = \Faker\Factory::create();
                            $family = Family::create([
                                'name' => 'Familia ' . $faker->lastName(),
                                'house_id' => $house->id
                            ]);

                            // 6. Create Patients
                            Patient::create([
                                'first_name' => $faker->firstName(),
                                'last_name' => $faker->lastName(),
                                'date_of_birth' => $faker->dateTimeBetween('-80 years', '-1 year'),
                                'gender' => $faker->randomElement(['M', 'F']),
                                'family_id' => $family->id
                            ]);
                        }
                    }
                }
            }
        }
    }
}
