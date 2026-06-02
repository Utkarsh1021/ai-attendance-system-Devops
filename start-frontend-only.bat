@echo off
echo ========================================
echo   Starting Frontend Only (Quick Test)
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found! Please install Node.js 20+
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Navigate to frontend
cd attendance-frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting React development server...
echo.
echo ========================================
echo   Frontend will open at:
echo   http://localhost:3001
echo ========================================
echo.
echo Note: Backend features won't work
echo This is for UI/UX testing only
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

REM Start frontend on port 3001
set PORT=3001
npm start
