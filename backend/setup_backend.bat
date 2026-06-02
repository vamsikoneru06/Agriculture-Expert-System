@echo off
title Agriculture Expert System - Backend Setup
color 0A

echo.
echo ============================================================
echo   Agriculture Expert System - Backend Setup
echo   Python Flask + MongoDB
echo ============================================================
echo.

:: ── Step 1: Check Python ──────────────────────────────────────
echo [1/5] Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found. Install Python 3.11 from python.org
    pause
    exit /b 1
)
echo       Python OK
echo.

:: ── Step 2: Create virtual environment ───────────────────────
echo [2/5] Creating virtual environment (venv)...
if exist venv (
    echo       venv already exists - skipping
) else (
    python -m venv venv
    echo       venv created
)
echo.

:: ── Step 3: Activate venv ─────────────────────────────────────
echo [3/5] Activating virtual environment...
call venv\Scripts\activate.bat
echo       Activated
echo.

:: ── Step 4: Install requirements ──────────────────────────────
echo [4/5] Installing Python packages (this may take 2-3 minutes)...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ERROR: Package installation failed
    pause
    exit /b 1
)
echo       All packages installed
echo.

:: ── Step 5: Train ML model ────────────────────────────────────
echo [5/5] Training ML model...
python ml_model\train_model.py
echo.

echo ============================================================
echo   Setup Complete!
echo   Now run:  start_backend.bat
echo ============================================================
echo.
pause
