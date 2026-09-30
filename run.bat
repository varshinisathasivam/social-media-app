@echo off
title Starting Pulse Social Media App
echo ========================================================
echo   Starting Pulse Social Media App (Frontend + Backend)
echo ========================================================
echo.

:: Check and install root dependencies if missing
if not exist node_modules (
    echo [Setup] Installing root dependencies...
    call npm install
)

:: Check and install backend dependencies if missing
if not exist backend\node_modules (
    echo [Setup] Installing backend dependencies...
    cd backend && call npm install && cd ..
)

:: Check and install frontend dependencies if missing
if not exist frontend\node_modules (
    echo [Setup] Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)

echo [1/2] Starting Backend Server on http://localhost:5000 ...
start "Pulse Backend (Port 5000)" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Vite Server on http://localhost:3000 ...
start "Pulse Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Pulse is now launching in your browser!
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:5000
echo ========================================================
pause
