@echo off
REM Quick Start Script for Campus Notification System (Windows)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Campus Notification System - Quick Start Setup           ║
echo ║                      Windows Version                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js is installed: 
node --version
echo ✅ npm is installed: 
npm --version
echo.

REM Setup Backend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Setting up Backend...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if exist "notification_app_be" (
    cd notification_app_be
    echo 📦 Installing backend dependencies...
    call npm install
    cd ..
    echo ✅ Backend setup complete
) else (
    echo ❌ Backend folder not found
    pause
    exit /b 1
)

echo.

REM Setup Frontend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Setting up Frontend...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if exist "notification_app_fe" (
    cd notification_app_fe
    echo 📦 Installing frontend dependencies...
    call npm install
    cd ..
    echo ✅ Frontend setup complete
) else (
    echo ❌ Frontend folder not found
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ Setup Complete!                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo 1️⃣  Start the Backend (in Command Prompt 1):
echo    cd notification_app_be
echo    npm start
echo    [Backend will run on http://localhost:5000]
echo.
echo 2️⃣  Start the Frontend (in Command Prompt 2):
echo    cd notification_app_fe
echo    npm start
echo    [Frontend will open on http://localhost:3000]
echo.
echo 3️⃣  View the Application:
echo    Open browser to http://localhost:3000
echo.
echo 4️⃣  Test Backend Health:
echo    curl http://localhost:5000/health
echo.
echo ────────────────────────────────────────────────────────────
echo Documentation:
echo   - Setup Guide: README.md
echo   - Design Doc: notification_system_design.md
echo   - Frontend Guide: notification_app_fe\README.md
echo   - Backend Guide: notification_app_be\README.md
echo   - Logging Guide: logging_middleware\README.md
echo ────────────────────────────────────────────────────────────
echo.
pause
