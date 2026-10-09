<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Meridian Moto Group API Documentation</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@{{ $uiVersion }}/swagger-ui.css" />
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
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@{{ $uiVersion }}/swagger-ui-bundle.js" crossorigin></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '/docs/openapi.yaml',
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
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
