@echo off
echo Starting both servers...

echo Starting Express API server on port 8787...
start "API Server" cmd /k "node server/simple-server.js"

echo Waiting 3 seconds for API server to start...
timeout /t 3 /nobreak > nul

echo Starting Vite dev server on port 5173...
start "Vite Dev Server" cmd /k "npx vite"

echo Both servers are starting...
echo API Server: http://localhost:8787
echo Dev Server: http://localhost:5173
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul

