<?php

test('ping returns ok response', function () {
    $response = $this->get('/api/v1/ping');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'ok',
            'service' => 'meridian-moto-api',
            'version' => 'v1',
        ]);
});
