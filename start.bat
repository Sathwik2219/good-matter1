@echo off
TITLE GoodMatter Launcher
COLOR 0B
cd /d "%~dp0"

echo.
echo  =====================================================
echo         GoodMatter - Start Development Environment
echo  =====================================================
echo.
echo  Starting backend server...
start cmd /k "cd /d "%~dp0backend" && npm install && npm start"

echo  Waiting for backend to initialise...
timeout /t 3 /nobreak >nul

echo  Starting frontend (browser will open automatically)...
start cmd /k "cd /d "%~dp0" && npm install && npm run dev"

echo.
echo  Both servers are starting up!
echo  - Frontend:  http://localhost:5173
echo  - Backend:   http://localhost:5001
echo.
echo  The browser will open automatically in a few seconds.
echo  Press any key to close this window.
pause >nul
