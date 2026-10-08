<?php

declare(strict_types=1);

use App\Models\Motorcycle;
use App\Repositories\Contracts\MotorcycleCatalogRepositoryInterface;
use App\Services\Site\MotorcycleCatalogService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\TestCase;

uses(TestCase::class);

test('motorcycle catalog service returns published motorcycle by slug or throws ModelNotFoundException', function () {
    $repo = Mockery::mock(MotorcycleCatalogRepositoryInterface::class);

    $moto = new Motorcycle(['name' => 'Apex RS 900', 'slug' => 'apex-rs-900']);

    $repo->shouldReceive('findPublishedBySlug')->once()->with('apex-rs-900')->andReturn($moto);
    $repo->shouldReceive('findPublishedBySlug')->once()->with('unknown')->andReturn(null);

    $service = new MotorcycleCatalogService($repo);

    expect($service->find('apex-rs-900'))->toBe($moto);

    $this->expectException(ModelNotFoundException::class);
    $service->find('unknown');
});
