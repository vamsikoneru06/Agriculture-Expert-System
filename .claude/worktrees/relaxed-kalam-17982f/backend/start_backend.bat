@echo off
title Agriculture Expert System - Flask Backend
color 0A

echo.
echo ============================================================
echo   Agriculture Expert System - Starting Flask Backend
echo   URL:  http://localhost:5000
echo   Docs: http://localhost:5000/api/docs
echo ============================================================
echo.

:: Activate virtual environment
call venv\Scripts\activate.bat

:: Start Flask app
python app.py

pause
