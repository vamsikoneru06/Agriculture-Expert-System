@echo off
title Agriculture Expert System - Launch All
color 0A

echo.
echo ============================================================
echo   Agriculture Expert System - Full Stack Launcher
echo ============================================================
echo.
echo   This will open 2 terminal windows:
echo     Window 1 - Flask Backend  (port 5000)
echo     Window 2 - React Frontend (port 3000)
echo.
echo   Make sure MongoDB is running before continuing!
echo   (See MONGODB_SETUP_GUIDE.md for instructions)
echo.
pause

:: Start Backend in new window
echo Starting Flask Backend...
start "Flask Backend" cmd /k "cd /d %~dp0backend && start_backend.bat"

:: Wait 3 seconds
timeout /t 3 /nobreak >nul

:: Start Frontend in new window
echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d %~dp0frontend && start_frontend.bat"

echo.
echo ============================================================
echo   Both servers starting...
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo   API Docs: http://localhost:5000/api/docs
echo ============================================================
echo.
pause
