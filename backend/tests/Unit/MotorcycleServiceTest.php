<?php

declare(strict_types=1);

use App\Contracts\ImageStorageInterface;
use App\Contracts\SlugGeneratorInterface;
use App\DataTransferObjects\MotorcycleData;
use App\Models\Motorcycle;
use App\Repositories\Contracts\MotorcycleRepositoryInterface;
use App\Services\MotorcycleService;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

uses(TestCase::class);

test('motorcycle service generates unique slug and stores image', function () {
    $repo = Mockery::mock(MotorcycleRepositoryInterface::class);
    $storage = Mockery::mock(ImageStorageInterface::class);
    $slugGen = Mockery::mock(SlugGeneratorInterface::class);

    $file = Mockery::mock(UploadedFile::class);

    $slugGen->shouldReceive('generate')->once()->andReturn('apex-rs-900');
    $storage->shouldReceive('store')->once()->with($file, 'motorcycles')->andReturn('motorcycles/test.jpg');

    $repo->shouldReceive('slugExists')->andReturn(false);

    $motoMock = Mockery::mock(Motorcycle::class)->makePartial();
    $motoMock->id = 1;
    $motoMock->shouldReceive('load')->with('brand')->andReturnSelf();

    $repo->shouldReceive('create')->once()->withArgs(function ($data) {
        return $data['slug'] === 'apex-rs-900' && $data['image_path'] === 'motorcycles/test.jpg';
    })->andReturn($motoMock);

    $service = new MotorcycleService($repo, $storage, $slugGen);
    $dto = new MotorcycleData(
        brandId: 1,
        name: 'Apex RS 900',
        slug: null,
        priceFrom: 12000,
        engineCc: 900,
        powerHp: 110,
        summary: null,
        image: $file,
        isFeatured: true,
        isPublished: true,
    );

    $moto = $service->create($dto);
    expect($moto->id)->toBe(1);
});
