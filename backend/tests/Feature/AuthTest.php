<?php

declare(strict_types=1);

use Database\Seeders\BrandSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(BrandSeeder::class);
    $this->seed(UserSeeder::class);
});

test('admin login succeeds and returns correct structure and role', function () {
    $password = env('SEED_USER_PASSWORD', 'Meridian @2026');

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@meridian.test',
        'password' => $password,
    ]);

    $response->assertStatus(Response::HTTP_OK)
        ->assertJsonStructure([
            'data' => [
                'token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                ],
            ],
        ])
        ->assertJsonPath('data.token_type', 'Bearer')
        ->assertJsonPath('data.user.role', 'admin');

    expect($response->json('data.token'))->toBeString()->not->toBeEmpty();
});

test('data entry login succeeds and returns assigned brands', function () {
    $password = env('SEED_USER_PASSWORD', 'Meridian @2026');

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'entry1@meridian.test',
        'password' => $password,
    ]);

    $response->assertStatus(Response::HTTP_OK)
        ->assertJsonPath('data.user.role', 'data_entry');

    $brands = $response->json('data.user.brands');
    expect($brands)->toBeArray()->toHaveCount(2);

    $slugs = collect($brands)->pluck('slug')->all();
    expect($slugs)->toContain('apex', 'nomad');
});

test('wrong password and unknown email return identical unauthorized message', function () {
    $password = env('SEED_USER_PASSWORD', 'Meridian @2026');

    $res1 = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@meridian.test',
        'password' => 'WrongPassword123',
    ]);

    $res2 = $this->postJson('/api/v1/auth/login', [
        'email' => 'unknown@meridian.test',
        'password' => $password,
    ]);

    $res1->assertStatus(Response::HTTP_UNAUTHORIZED)
        ->assertJson(['message' => 'These credentials do not match our records.']);

    $res2->assertStatus(Response::HTTP_UNAUTHORIZED)
        ->assertJson(['message' => 'These credentials do not match our records.']);
});

test('missing email or password returns unprocessable entity with field errors', function () {
    $response = $this->postJson('/api/v1/auth/login', []);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors(['email', 'password']);
});

test('get me without token returns unauthorized', function () {
    $response = $this->getJson('/api/v1/auth/me');

    $response->assertStatus(Response::HTTP_UNAUTHORIZED)
        ->assertJson(['message' => 'Unauthenticated.']);
});

test('get me with valid token returns current user with role and brands', function () {
    $password = env('SEED_USER_PASSWORD', 'Meridian @2026');

    $loginResponse = $this->postJson('/api/v1/auth/login', [
        'email' => 'entry1@meridian.test',
        'password' => $password,
    ]);

    $token = $loginResponse->json('data.token');

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/auth/me');

    $response->assertStatus(Response::HTTP_OK)
        ->assertJsonPath('data.email', 'entry1@meridian.test')
        ->assertJsonPath('data.role', 'data_entry');

    expect($response->json('data.brands'))->toHaveCount(2);
});

test('logout returns no content and deletes current token', function () {
    $password = env('SEED_USER_PASSWORD', 'Meridian @2026');

    $loginResponse = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@meridian.test',
        'password' => $password,
    ]);

    $token = $loginResponse->json('data.token');

    expect(DB::table('personal_access_tokens')->count())->toBe(1);

    $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/auth/logout');

    $logoutResponse->assertStatus(Response::HTTP_NO_CONTENT);

    expect(DB::table('personal_access_tokens')->count())->toBe(0);

    $this->app['auth']->forgetGuards();

    // Using the same token on /me should now fail with 401
    $meResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/auth/me');

    $meResponse->assertStatus(Response::HTTP_UNAUTHORIZED);
});

test('sixth rapid failed login attempt returns too many requests', function () {
    $email = 'admin@meridian.test';

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/v1/auth/login', [
            'email' => $email,
            'password' => 'WrongPassword',
        ])->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => $email,
        'password' => 'WrongPassword',
    ]);

    $response->assertStatus(Response::HTTP_TOO_MANY_REQUESTS);
});

test('token is hashed in database and differs from plain token', function () {
    $password = env('SEED_USER_PASSWORD', 'Meridian @2026');

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@meridian.test',
        'password' => $password,
    ]);

    $plainToken = $response->json('data.token');
    $dbTokenRecord = DB::table('personal_access_tokens')->first();

    expect($dbTokenRecord)->not->toBeNull();

    // The plain token includes ID prefix like "1|plain_text..." or just random string depending on sanctum version
    // But hash stored in DB is sha256 hash of the token part
    $tokenParts = explode('|', $plainToken);
    $tokenValue = count($tokenParts) > 1 ? $tokenParts[1] : $plainToken;

    expect($dbTokenRecord->token)->not->toBe($tokenValue);
    expect(hash_equals($dbTokenRecord->token, hash('sha256', $tokenValue)))->toBeTrue();
});
