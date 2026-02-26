@echo off
REM Quick development script for Windows

echo.
echo Choose an option:
echo 1. Start Backend Only
echo 2. Start Frontend Only
echo 3. Start Both (Recommended)
echo 4. Run Database Migrations
echo 5. Create Django Superuser
echo 6. Reset Database
echo.

set /p choice="Enter choice (1-6): "

if "%choice%"=="1" (
    echo Starting Django Backend...
    cd backend
    python manage.py runserver 0.0.0.0:8000
)

if "%choice%"=="2" (
    echo Starting Vue Frontend...
    cd frontend
    npm run dev
)

if "%choice%"=="3" (
    call START_HOA_SYSTEM.bat
)

if "%choice%"=="4" (
    echo Running Migrations...
    cd backend
    python manage.py migrate
    echo Done!
    pause
)

if "%choice%"=="5" (
    echo Creating Superuser...
    cd backend
    python manage.py createsuperuser
)

if "%choice%"=="6" (
    echo WARNING: This will delete the database!
    set /p confirm="Type 'yes' to confirm: "
    if "%confirm%"=="yes" (
        cd backend
        del db.sqlite3
        python manage.py migrate
        echo Database reset complete!
    )
    pause
)
