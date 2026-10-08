<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ImageStorageInterface;
use App\Contracts\SlugGeneratorInterface;
use App\Repositories\Contracts\AdminUserRepositoryInterface;
use App\Repositories\Contracts\BrandRepositoryInterface;
use App\Repositories\Contracts\MotorcycleRepositoryInterface;
use App\Repositories\Contracts\PromotionRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\AdminUserRepository;
use App\Repositories\Eloquent\BrandRepository;
use App\Repositories\Eloquent\MotorcycleRepository;
use App\Repositories\Eloquent\PromotionRepository;
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
        $this->app->bind(ImageStorageInterface::class, PublicDiskImageStorage::class);
        $this->app->bind(SlugGeneratorInterface::class, SlugGenerator::class);
    }

    public function boot(): void
    {
        //
    }
}
