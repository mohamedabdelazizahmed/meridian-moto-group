<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Support\SeedAssets;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Volt',
                'slug' => 'volt',
                'segment' => 'Urban Mobility',
                'tagline' => 'Electric city mobility redefined.',
                'description' => 'Volt engineers high-performance electric motorcycles designed specifically for agile, zero-emission urban commuting and modern city lifestyles.',
                'accent_color' => '#22D3C5',
                'hero_image_path' => SeedAssets::get('brands/volt.svg'),
                'is_active' => true,
            ],
            [
                'name' => 'Nomad',
                'slug' => 'nomad',
                'segment' => 'Adventure & Touring',
                'tagline' => 'Conquer the uncharted horizon.',
                'description' => 'Nomad builds rugged, dependable adventure motorcycles engineered to traverse extreme terrain and cross continents with absolute confidence.',
                'accent_color' => '#A8B36A',
                'hero_image_path' => SeedAssets::get('brands/nomad.svg'),
                'is_active' => true,
            ],
            [
                'name' => 'Apex',
                'slug' => 'apex',
                'segment' => 'Performance',
                'tagline' => 'Pure track-bred adrenaline.',
                'description' => 'Apex merges cutting-edge racing aerodynamics with uncompromising power to deliver ultimate track and sport performance.',
                'accent_color' => '#E5322D',
                'hero_image_path' => SeedAssets::get('brands/apex.svg'),
                'is_active' => true,
            ],
            [
                'name' => 'Sovereign',
                'slug' => 'sovereign',
                'segment' => 'Premium',
                'tagline' => 'Uncompromising luxury on two wheels.',
                'description' => 'Sovereign crafts masterclass luxury cruisers and touring machines combining timeless elegance with effortless modern torque.',
                'accent_color' => '#C9CDD6',
                'hero_image_path' => SeedAssets::get('brands/sovereign.svg'),
                'is_active' => true,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(['slug' => $brand['slug']], $brand);
        }
    }
}
