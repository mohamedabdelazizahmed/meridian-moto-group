<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Meridian Moto Group API Documentation</title>
    <link rel="stylesheet" href="{{ asset('vendor/swagger-ui/swagger-ui.css') }}" />
    <style>
        body {
            margin: 0;
            background: #1a1a1a;
            color: #f3f4f6;
        }
        .swagger-ui .topbar {
            background-color: #111827;
        }
    </style>
</head>
<body>
    <div id="swagger-ui">Loading API documentation...</div>
    <script src="{{ asset('vendor/swagger-ui/swagger-ui-bundle.js') }}"></script>
    <script src="{{ asset('vendor/swagger-ui/swagger-ui-standalone-preset.js') }}"></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '/docs/openapi.yaml',
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                layout: "BaseLayout",
                persistAuthorization: true,
                tryItOutEnabled: true,
                displayRequestDuration: true,
                docExpansion: 'list'
            });
        };
    </script>
</body>
</html>
