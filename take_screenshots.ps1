$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

New-Item -ItemType Directory -Force -Path "$root\docs\screenshots" | Out-Null

Write-Host "Taking swagger-ui.png..."
& $chrome --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=20000 --window-size=1440,2000 "--screenshot=$root\docs\screenshots\swagger-ui.png" http://localhost:8100/docs

Write-Host "Taking home-desktop.png..."
& $chrome --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=20000 --window-size=1440,3200 "--screenshot=$root\docs\screenshots\home-desktop.png" http://localhost:3100/

Write-Host "Taking home-mobile.png..."
& $chrome --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=20000 --window-size=390,3600 "--screenshot=$root\docs\screenshots\home-mobile.png" http://localhost:3100/

Start-Sleep -Seconds 3
Get-ChildItem "$root\docs\screenshots"
