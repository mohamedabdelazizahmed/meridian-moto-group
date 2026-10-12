$ErrorActionPreference = "Stop"

Write-Host "Running smoke tests..."

# 1. Homepage
$res1 = curl.exe -s -i http://localhost:3100/
Write-Host "Homepage response received."

# 2. CMS login
$codeLogin = curl.exe -s -o NUL -w "%{http_code}" http://localhost:3100/cms/login
Write-Host "CMS Login status: $codeLogin"

# 3. API endpoints
$p1 = curl.exe -s -o NUL -w "%{http_code}" http://localhost:8100/api/v1/ping
$p2 = curl.exe -s -o NUL -w "%{http_code}" http://localhost:8100/docs
$p3 = curl.exe -s -o NUL -w "%{http_code}" http://localhost:8100/docs/openapi.yaml
Write-Host "API ping: $p1, Docs: $p2, OpenAPI: $p3"

# 4. Admin login via API / auth
$loginBody = '{"email":"admin@meridian.test","password":"Meridian @2026"}'
$jar = "$env:TEMP\cookie.txt"
if (Test-Path $jar) { Remove-Item $jar }

$loginRes = curl.exe -s -i -c $jar -X POST http://localhost:8100/api/v1/auth/login -H "Content-Type: application/json" -d $loginBody
Write-Host "Login response headers and body:"
Write-Host $loginRes

$meRes = curl.exe -s -b $jar http://localhost:8100/api/v1/auth/me
Write-Host "Auth me response: $meRes"
