<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Symfony\Component\Yaml\Yaml;

test('openapi specification parses and has required keys', function () {
    $specPath = resource_path('openapi/openapi.yaml');
    expect(file_exists($specPath))->toBeTrue();

    $spec = Yaml::parseFile($specPath);

    expect($spec)
        ->toHaveKey('openapi')
        ->toHaveKey('info')
        ->toHaveKey('paths')
        ->toHaveKey('components');
});

test('every api v1 route is documented in openapi spec and vice versa', function () {
    $specPath = resource_path('openapi/openapi.yaml');
    $spec = Yaml::parseFile($specPath);
    $specPaths = $spec['paths'] ?? [];

    $routes = Route::getRoutes();
    $documentedRoutes = [];

    foreach ($routes as $route) {
        $uri = $route->uri();
        if (! str_starts_with($uri, 'api/v1')) {
            continue;
        }

        $path = '/'.ltrim(substr($uri, 6), '/');
        if (str_starts_with($path, '/admin/')) {
            $path = preg_replace('/\{[^}]+\}/', '{id}', $path);
        } else {
            $path = preg_replace('/\{[^}]+\}/', '{slug}', $path);
        }

        $methods = array_diff($route->methods(), ['HEAD']);

        foreach ($methods as $method) {
            $methodLower = strtolower($method);
            $documentedRoutes[] = strtoupper($method).' '.$path;

            expect($specPaths)->toHaveKey($path);
            $pathItem = $specPaths[$path];
            expect($pathItem)->toHaveKey($methodLower);
        }
    }

    foreach ($specPaths as $path => $pathItem) {
        foreach (['get', 'post', 'put', 'patch', 'delete'] as $method) {
            if (isset($pathItem[$method])) {
                $checkRoute = strtoupper($method).' '.$path;
                expect($documentedRoutes)->toContain($checkRoute);
            }
        }
    }
});

test('docs endpoints return correct response and respect configuration', function () {
    config(['api-docs.enabled' => true]);

    $response = $this->get('/docs');
    $response->assertStatus(200);
    $response->assertSee('/docs/openapi.yaml');

    $specResponse = $this->get('/docs/openapi.yaml');
    $specResponse->assertStatus(200);
    $specResponse->assertHeader('Content-Type', 'application/yaml');

    config(['api-docs.enabled' => false]);

    $this->get('/docs')->assertStatus(404);
    $this->get('/docs/openapi.yaml')->assertStatus(404);
});

test('docs view references only local swagger assets and assets exist', function () {
    config(['api-docs.enabled' => true]);

    $response = $this->get('/docs');
    $response->assertStatus(200);
    $content = $response->getContent();

    expect($content)->not->toContain('https://cdn.jsdelivr.net');

    expect(file_exists(public_path('vendor/swagger-ui/swagger-ui.css')))->toBeTrue();
    expect(file_exists(public_path('vendor/swagger-ui/swagger-ui-bundle.js')))->toBeTrue();
    expect(file_exists(public_path('vendor/swagger-ui/swagger-ui-standalone-preset.js')))->toBeTrue();
});

test('every operation declares security and lists at least one response', function () {
    $specPath = resource_path('openapi/openapi.yaml');
    $spec = Yaml::parseFile($specPath);
    $specPaths = $spec['paths'] ?? [];

    $publicPaths = [
        'GET /ping',
        'POST /auth/login',
        'GET /brands',
        'GET /brands/{slug}',
        'GET /motorcycles',
        'GET /motorcycles/{slug}',
        'GET /promotions',
        'GET /locations',
        'POST /test-ride-requests',
    ];

    foreach ($specPaths as $path => $pathItem) {
        foreach (['get', 'post', 'put', 'patch', 'delete'] as $method) {
            if (! isset($pathItem[$method])) {
                continue;
            }

            $op = $pathItem[$method];

            if (isset($op['$ref'])) {
                preg_match('/~\1paths~1([^"]+)\/([a-z]+)$/', $op['$ref'], $matches);
                if (count($matches) === 3) {
                    $refPath = str_replace('~1', '/', $matches[1]);
                    $refMethod = $matches[2];
                    $op = $specPaths[$refPath][$refMethod] ?? $op;
                }
            }

            $key = strtoupper($method).' '.$path;

            expect($op)->toHaveKey('responses');
            expect(count($op['responses']))->toBeGreaterThan(0);

            if (in_array($key, $publicPaths, true)) {
                if (isset($op['security'])) {
                    expect($op['security'])->toBe([]);
                }
            } else {
                if (isset($op['security'])) {
                    expect($op['security'])->not->toBe([]);
                }
            }
        }
    }
});
