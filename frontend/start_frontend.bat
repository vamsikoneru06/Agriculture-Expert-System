@echo off
title Agriculture Expert System - React Frontend
color 0B

echo.
echo ============================================================
echo   Agriculture Expert System - Starting React Frontend
echo   URL: http://localhost:3000
echo ============================================================
echo.

:: Install packages if node_modules doesn't exist
if not exist node_modules (
    echo Installing npm packages (first time only)...
    npm install
)

:: Start React dev server
npm start

pause
