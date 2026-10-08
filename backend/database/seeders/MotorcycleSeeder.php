<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Motorcycle;
use App\Support\SeedAssets;
use Illuminate\Database\Seeder;

class MotorcycleSeeder extends Seeder
{
    public function run(): void
    {
        $apex = Brand::where('slug', 'apex')->first();
        $volt = Brand::where('slug', 'volt')->first();
        $nomad = Brand::where('slug', 'nomad')->first();
        $sovereign = Brand::where('slug', 'sovereign')->first();

        $motorcycles = [
            [
                'brand_id' => $apex?->id,
                'name' => 'Apex RS 900',
                'slug' => 'apex-rs-900',
                'price_from' => 148000.00,
                'engine_cc' => 900,
                'power_hp' => 214,
                'image_path' => SeedAssets::get('motorcycles/apex-rs-900.svg'),
                'summary' => 'The ultimate track-ready hyper-sport machine delivering explosive acceleration.',
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'brand_id' => $apex?->id,
                'name' => 'Apex Track 600',
                'slug' => 'apex-track-600',
                'price_from' => 98000.00,
                'engine_cc' => 599,
                'power_hp' => 138,
                'image_path' => SeedAssets::get('motorcycles/apex-track-600.svg'),
                'summary' => 'Precision handling and high-revving middleweight power for discerning riders.',
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'brand_id' => $volt?->id,
                'name' => 'Volt Pulse RS',
                'slug' => 'volt-pulse-rs',
                'price_from' => 56000.00,
                'engine_cc' => 0,
                'power_hp' => 161,
                'image_path' => SeedAssets::get('motorcycles/volt-pulse-rs.svg'),
                'summary' => 'Instant electric torque engineered for the modern metropolis.',
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'brand_id' => $nomad?->id,
                'name' => 'Nomad Horizon 1250',
                'slug' => 'nomad-horizon-1250',
                'price_from' => 112500.00,
                'engine_cc' => 1254,
                'power_hp' => 145,
                'image_path' => SeedAssets::get('motorcycles/nomad-horizon-1250.svg'),
                'summary' => 'The definitive cross-continent adventure tourer built for limitless exploration.',
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'brand_id' => $nomad?->id,
                'name' => 'Nomad Desert 800',
                'slug' => 'nomad-desert-800',
                'price_from' => 84000.00,
                'engine_cc' => 890,
                'power_hp' => 119,
                'image_path' => SeedAssets::get('motorcycles/nomad-desert-800.svg'),
                'summary' => 'Agile middleweight endurance for severe off-road terrain and dune running.',
                'is_featured' => false,
                'is_published' => false,
            ],
            [
                'brand_id' => $sovereign?->id,
                'name' => 'Sovereign Wraith 1800',
                'slug' => 'sovereign-wraith-1800',
                'price_from' => 210000.00,
                'engine_cc' => 1802,
                'power_hp' => 126,
                'image_path' => SeedAssets::get('motorcycles/sovereign-wraith-1800.svg'),
                'summary' => 'Handcrafted luxury cruiser delivering effortless torque and majestic presence.',
                'is_featured' => true,
                'is_published' => true,
            ],
        ];

        foreach ($motorcycles as $moto) {
            if ($moto['brand_id']) {
                Motorcycle::updateOrCreate(['slug' => $moto['slug']], $moto);
            }
        }
    }
}
