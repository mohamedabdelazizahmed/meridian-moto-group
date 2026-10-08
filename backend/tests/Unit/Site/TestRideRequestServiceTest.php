<?php

declare(strict_types=1);

use App\DataTransferObjects\Site\TestRideRequestData;
use App\Models\TestRideRequest;
use App\Repositories\Contracts\MotorcycleCatalogRepositoryInterface;
use App\Repositories\Contracts\TestRideRequestRepositoryInterface;
use App\Services\Site\TestRideRequestService;
use Tests\TestCase;

uses(TestCase::class);

test('test ride request service resolves motorcycle slug to id and creates request', function () {
    $testRideRepo = Mockery::mock(TestRideRequestRepositoryInterface::class);
    $motorcycleRepo = Mockery::mock(MotorcycleCatalogRepositoryInterface::class);

    $motorcycleRepo->shouldReceive('findPublishedIdBySlug')->once()->with('apex-rs-900')->andReturn(5);

    $created = new TestRideRequest([
        'name' => 'John Doe',
        'phone' => '+1234567890',
        'email' => 'john@example.com',
        'preferred_date' => '2026-11-01',
        'motorcycle_id' => 5,
    ]);

    $testRideRepo->shouldReceive('create')->once()->withArgs(function ($attrs) {
        return $attrs['name'] === 'John Doe' && $attrs['motorcycle_id'] === 5;
    })->andReturn($created);

    $service = new TestRideRequestService($testRideRepo, $motorcycleRepo);
    $dto = new TestRideRequestData(
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        preferredDate: '2026-11-01',
        motorcycleSlug: 'apex-rs-900',
        motorcycleId: null,
    );

    $result = $service->create($dto);
    expect($result->name)->toBe('John Doe');
});
