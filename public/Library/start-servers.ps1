Write-Host "Starting both servers..." -ForegroundColor Green

Write-Host "Starting Express API server on port 8787..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server/simple-server.js" -WindowStyle Normal

Write-Host "Waiting 3 seconds for API server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Vite dev server on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx vite" -WindowStyle Normal

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "API Server: http://localhost:8787" -ForegroundColor Cyan
Write-Host "Dev Server: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)" -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

