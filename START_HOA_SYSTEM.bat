@echo off
REM DHSUD HOA Management System - Automated Startup Script
REM This script starts both Django backend and Vue.js frontend

title HOA Management System
color 0A

echo.
echo ====================================
echo DHSUD HOA Management System
echo Starting Backend and Frontend...
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

setlocal enabledelayedexpansion

REM Navigate to backend directory
cd /d "%~dp0backend"

echo.
echo Installing/Updating Python dependencies...
pip install -q -r requirements.txt

echo Running Django migrations...
python manage.py migrate

REM Start Django backend in a new window
echo Starting Django server on http://localhost:8000...
start "Django Backend - HOA System" cmd /k "python manage.py runserver 0.0.0.0:8000"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Navigate to frontend directory
cd /d "%~dp0..\frontend"

echo.
echo Installing/Updating Node.js dependencies...
npm install -q

REM Start Vue.js frontend in a new window
echo Starting Vue.js dev server on http://localhost:5173...
start "Vue Frontend - HOA System" cmd /k npm run dev

echo.
echo ====================================
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo Admin Panel: http://localhost:8000/admin/
echo ====================================
echo.
echo To stop the servers, close the terminal windows.
echo.
pause
