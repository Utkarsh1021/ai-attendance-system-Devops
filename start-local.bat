@echo off
echo ========================================
echo   AI Attendance System - Local Startup
echo ========================================
echo.

echo [1/4] Checking prerequisites...
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found! Please install Node.js 20+
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node --version

REM Check Java
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java not found! Please install Java 17+
    pause
    exit /b 1
)
echo [OK] Java found:
java --version | findstr "version"

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found! Please install Python 3.8+
    pause
    exit /b 1
)
echo [OK] Python found:
python --version

echo.
echo [2/4] Starting MySQL Database...
echo.

REM Check if Docker is available
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting MySQL container...
    docker start persistent_db 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Creating new MySQL container...
        docker run --name attendance-mysql -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=userdb -e MYSQL_USER=appuser -e MYSQL_PASSWORD=apppass -p 3306:3306 -d mysql:8.0
    )
    echo [OK] MySQL is running
) else (
    echo [WARNING] Docker not found. Make sure MySQL is running on localhost:3306
)

echo.
echo [3/4] Installing dependencies...
echo.

REM Install frontend dependencies
if not exist "attendance-frontend\node_modules" (
    echo Installing frontend dependencies...
    cd attendance-frontend
    call npm install
    cd ..
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

REM Install AI service dependencies
if not exist "ai-service\venv" (
    echo Creating Python virtual environment...
    cd ai-service
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    deactivate
    cd ..
    echo [OK] AI service dependencies installed
) else (
    echo [OK] AI service dependencies already installed
)

echo.
echo [4/4] Starting all services...
echo.

echo ========================================
echo   Services will start in new windows
echo ========================================
echo.
echo Backend:     http://localhost:8080
echo AI Service:  http://localhost:5000
echo Frontend:    http://localhost:3001
echo.
echo Press Ctrl+C in each window to stop
echo ========================================
echo.

REM Start Backend
start "Backend - Spring Boot" cmd /k "cd /d %~dp0 && mvnw.cmd spring-boot:run"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start AI Service
start "AI Service - Flask" cmd /k "cd /d %~dp0ai-service && venv\Scripts\activate && python app.py"

REM Wait a bit for AI service to start
timeout /t 3 /nobreak >nul

REM Start Frontend
start "Frontend - React" cmd /k "cd /d %~dp0attendance-frontend && set PORT=3001 && npm start"

echo.
echo ========================================
echo   All services are starting!
echo ========================================
echo.
echo Wait for all services to start, then visit:
echo http://localhost:3001
echo.
echo Press any key to exit this window...
pause >nul
