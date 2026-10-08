<?php

declare(strict_types=1);

use App\DataTransferObjects\Auth\LoginData;
use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\AuthService;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Illuminate\Contracts\Hashing\Hasher;

test('unknown email throws invalid credentials exception', function () {
    $userRepo = Mockery::mock(UserRepositoryInterface::class);
    $userRepo->shouldReceive('findByEmail')
        ->once()
        ->with('unknown@meridian.test')
        ->andReturn(null);

    $hasher = Mockery::mock(Hasher::class);
    $hasher->shouldReceive('check')
        ->once()
        ->with('password123', Mockery::any())
        ->andReturn(false);

    $config = Mockery::mock(ConfigRepository::class);

    $service = new AuthService($userRepo, $hasher, $config);
    $dto = new LoginData('unknown@meridian.test', 'password123');

    $service->login($dto);
})->throws(InvalidCredentialsException::class, 'These credentials do not match our records.');

test('wrong password throws invalid credentials exception', function () {
    $user = new class extends User
    {
        public function __construct()
        {
            $this->attributes['password'] = 'hashed-password';
        }
    };

    $userRepo = Mockery::mock(UserRepositoryInterface::class);
    $userRepo->shouldReceive('findByEmail')
        ->once()
        ->with('admin@meridian.test')
        ->andReturn($user);

    $hasher = Mockery::mock(Hasher::class);
    $hasher->shouldReceive('check')
        ->once()
        ->with('WrongPassword123', 'hashed-password')
        ->andReturn(false);

    $config = Mockery::mock(ConfigRepository::class);

    $service = new AuthService($userRepo, $hasher, $config);
    $dto = new LoginData('admin@meridian.test', 'WrongPassword123');

    $service->login($dto);
})->throws(InvalidCredentialsException::class, 'These credentials do not match our records.');

test('correct credentials return token and user', function () {
    $user = Mockery::mock(User::class)->makePartial();
    $user->password = 'hashed-password';

    $tokenResult = new class
    {
        public string $plainTextToken = 'mock-plain-token';
    };

    $user->shouldReceive('createToken')
        ->once()
        ->andReturn($tokenResult);

    $userRepo = Mockery::mock(UserRepositoryInterface::class);
    $userRepo->shouldReceive('findByEmail')
        ->once()
        ->with('admin@meridian.test')
        ->andReturn($user);

    $userRepo->shouldReceive('loadAccessContext')
        ->once()
        ->with($user)
        ->andReturn($user);

    $hasher = Mockery::mock(Hasher::class);
    $hasher->shouldReceive('check')
        ->once()
        ->with('CorrectPassword123', 'hashed-password')
        ->andReturn(true);

    $config = Mockery::mock(ConfigRepository::class);
    $config->shouldReceive('get')
        ->once()
        ->with('sanctum.expiration', 480)
        ->andReturn(480);

    $service = new AuthService($userRepo, $hasher, $config);
    $dto = new LoginData('admin@meridian.test', 'CorrectPassword123');

    $result = $service->login($dto);

    expect($result)
        ->toHaveKey('token', 'mock-plain-token')
        ->toHaveKey('user');
});
