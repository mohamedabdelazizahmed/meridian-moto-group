<?php

namespace Database\Seeders;

use App\Enums\LocationType;
use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'name' => 'Dubai Flagship',
                'type' => LocationType::Showroom,
                'city' => 'Dubai',
                'address' => 'Sheikh Zayed Road, Al Quoz 3',
                'phone' => '+971 4 555 0192',
                'latitude' => 25.2048493,
                'longitude' => 55.2707828,
            ],
            [
                'name' => 'Abu Dhabi Circuit Hub',
                'type' => LocationType::Service,
                'city' => 'Abu Dhabi',
                'address' => 'Yas Marina Circuit Area',
                'phone' => '+971 2 555 0148',
                'latitude' => 24.4538840,
                'longitude' => 54.3773438,
            ],
            [
                'name' => 'Riyadh Luxury Galleria',
                'type' => LocationType::Showroom,
                'city' => 'Riyadh',
                'address' => 'Al Olaya District, King Fahd Road',
                'phone' => '+966 11 555 0173',
                'latitude' => 24.7135517,
                'longitude' => 46.6752957,
            ],
            [
                'name' => 'Doha Experience Center',
                'type' => LocationType::Showroom,
                'city' => 'Doha',
                'address' => 'The Pearl-Qatar, Boulevard Promenade',
                'phone' => '+974 44 555 0121',
                'latitude' => 25.2854473,
                'longitude' => 51.5310398,
            ],
        ];

        foreach ($locations as $loc) {
            Location::updateOrCreate(['name' => $loc['name']], $loc);
        }
    }
}
