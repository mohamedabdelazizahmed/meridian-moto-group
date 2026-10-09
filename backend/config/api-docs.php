<?php

declare(strict_types=1);

return [
    'enabled' => (bool) env('API_DOCS_ENABLED', true),
    'spec_path' => resource_path('openapi/openapi.yaml'),
    'ui_version' => '5.11.0',
];
