<?php

return [
    'paths' => ['api/*', '/broadcasting/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:8080', 'http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
