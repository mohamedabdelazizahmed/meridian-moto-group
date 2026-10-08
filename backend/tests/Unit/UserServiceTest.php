<?php

declare(strict_types=1);

use App\Exceptions\CannotDeleteSelfException;
use App\Models\User;
use App\Repositories\Contracts\AdminUserRepositoryInterface;
use App\Services\UserService;
use Tests\TestCase;

uses(TestCase::class);

test('user service throws exception when admin tries to delete themselves', function () {
    $repo = Mockery::mock(AdminUserRepositoryInterface::class);
    $service = new UserService($repo);

    $admin = new User(['id' => 1]);

    $service->delete($admin, $admin);
})->throws(CannotDeleteSelfException::class);
