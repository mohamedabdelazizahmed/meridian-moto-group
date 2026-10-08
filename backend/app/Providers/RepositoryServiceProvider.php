<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ImageStorageInterface;
use App\Contracts\SlugGeneratorInterface;
use App\Repositories\Contracts\AdminUserRepositoryInterface;
use App\Repositories\Contracts\BrandCatalogRepositoryInterface;
use App\Repositories\Contracts\BrandRepositoryInterface;
use App\Repositories\Contracts\LocationCatalogRepositoryInterface;
use App\Repositories\Contracts\MotorcycleCatalogRepositoryInterface;
use App\Repositories\Contracts\MotorcycleRepositoryInterface;
use App\Repositories\Contracts\PromotionCatalogRepositoryInterface;
use App\Repositories\Contracts\PromotionRepositoryInterface;
use App\Repositories\Contracts\TestRideRequestRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\AdminUserRepository;
use App\Repositories\Eloquent\BrandCatalogRepository;
use App\Repositories\Eloquent\BrandRepository;
use App\Repositories\Eloquent\LocationCatalogRepository;
use App\Repositories\Eloquent\MotorcycleCatalogRepository;
use App\Repositories\Eloquent\MotorcycleRepository;
use App\Repositories\Eloquent\PromotionCatalogRepository;
use App\Repositories\Eloquent\PromotionRepository;
use App\Repositories\Eloquent\TestRideRequestRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Services\SlugGenerator;
use App\Services\Storage\PublicDiskImageStorage;
use Illuminate\Support\ServiceProvider;

final class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BrandRepositoryInterface::class, BrandRepository::class);
        $this->app->bind(MotorcycleRepositoryInterface::class, MotorcycleRepository::class);
        $this->app->bind(PromotionRepositoryInterface::class, PromotionRepository::class);
        $this->app->bind(AdminUserRepositoryInterface::class, AdminUserRepository::class);

        $this->app->bind(BrandCatalogRepositoryInterface::class, BrandCatalogRepository::class);
        $this->app->bind(MotorcycleCatalogRepositoryInterface::class, MotorcycleCatalogRepository::class);
        $this->app->bind(PromotionCatalogRepositoryInterface::class, PromotionCatalogRepository::class);
        $this->app->bind(LocationCatalogRepositoryInterface::class, LocationCatalogRepository::class);
        $this->app->bind(TestRideRequestRepositoryInterface::class, TestRideRequestRepository::class);

        $this->app->bind(ImageStorageInterface::class, PublicDiskImageStorage::class);
        $this->app->bind(SlugGeneratorInterface::class, SlugGenerator::class);
    }

    public function boot(): void
    {
        //
    }
}
