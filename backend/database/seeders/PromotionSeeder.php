<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Promotion;
use App\Models\User;
use App\Support\SeedAssets;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@meridian.test')->first();
        $apex = Brand::where('slug', 'apex')->first();
        $nomad = Brand::where('slug', 'nomad')->first();
        $volt = Brand::where('slug', 'volt')->first();
        $sovereign = Brand::where('slug', 'sovereign')->first();

        $promotions = [
            [
                'brand_id' => $apex?->id,
                'title' => 'Apex Track Academy Package',
                'description' => 'Complimentary professional coaching session with every Apex model purchase.',
                'image_path' => SeedAssets::get('brands/apex.svg'),
                'starts_at' => now()->subDays(5)->toDateString(),
                'ends_at' => now()->addDays(30)->toDateString(),
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
            [
                'brand_id' => $nomad?->id,
                'title' => '0% Finance on Nomad Touring Series',
                'description' => 'Experience zero-interest financing for 24 months across all Nomad adventure motorcycles.',
                'image_path' => SeedAssets::get('brands/nomad.svg'),
                'starts_at' => now()->subDays(2)->toDateString(),
                'ends_at' => now()->addDays(45)->toDateString(),
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
            [
                'brand_id' => $volt?->id,
                'title' => 'Volt Urban Trade-In Advantage',
                'description' => 'Receive an extra 5000 AED valuation bonus when trading in any combustion scooter for a Volt.',
                'image_path' => SeedAssets::get('brands/volt.svg'),
                'starts_at' => now()->subDays(1)->toDateString(),
                'ends_at' => now()->addDays(20)->toDateString(),
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
            [
                'brand_id' => $sovereign?->id,
                'title' => 'Sovereign Heritage Winter Jubilee',
                'description' => 'Expired seasonal promotion event for Sovereign collectors.',
                'image_path' => SeedAssets::get('brands/sovereign.svg'),
                'starts_at' => now()->subDays(40)->toDateString(),
                'ends_at' => now()->subDays(10)->toDateString(),
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
            [
                'brand_id' => $apex?->id,
                'title' => 'Upcoming Apex Concept Launch',
                'description' => 'Unpublished draft previewing next generation aerodynamic tech.',
                'image_path' => null,
                'starts_at' => now()->addDays(10)->toDateString(),
                'ends_at' => now()->addDays(60)->toDateString(),
                'is_published' => false,
                'created_by' => $admin?->id,
            ],
        ];

        foreach ($promotions as $promo) {
            if ($promo['brand_id']) {
                Promotion::updateOrCreate(
                    ['title' => $promo['title'], 'brand_id' => $promo['brand_id']],
                    $promo
                );
            }
        }
    }
}
