@echo off
setlocal enabledelayedexpansion

echo  Bat dau deploy Backend...

REM Get project directory
set PROJECT_DIR=C:\www\websolar
set BACKEND_DIR=%PROJECT_DIR%\backend

REM Check if project directory exists
if not exist "%PROJECT_DIR%" (
    echo  Thu muc du an khong ton tai: %PROJECT_DIR%
    exit /b 1
)

cd /d %PROJECT_DIR%

REM Pull latest code
echo Dang pull code moi tu Git...
git pull origin main
if errorlevel 1 (
    git pull origin master
)

REM Backend deployment
echo.
echo  Dang cap nhat Backend...
cd /d %BACKEND_DIR%

if not exist ".env" (
    echo   File .env chua ton tai. Dang tao tu .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo   Vui long chinh sua file .env voi thong tin thuc te!
    )
)

echo Dang cai dat dependencies...
call npm install --production
if errorlevel 1 (
    echo  Co loi khi cai dat dependencies backend, nhung tiep tuc...
)

if not exist "images" mkdir images

where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    echo Dang restart PM2 backend...
    pm2 restart websolar-backend
    if errorlevel 1 (
        echo   Backend chua chay. Dang start...
        pm2 start ecosystem.config.js
    )
    pm2 save
    echo  Backend da duoc restart
) else (
    echo  PM2 chua duoc cai dat. Cai dat: npm install -g pm2
    exit /b 1
)

echo.
echo  Deploy Backend hoan tat!
echo.
echo  Kiem tra:
echo   - Backend: pm2 status
echo   - Logs: pm2 logs websolar-backend
echo.

pause

