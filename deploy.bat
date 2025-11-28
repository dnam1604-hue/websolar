@echo off
REM WebSolar Deployment Script for Windows Server (Batch)
REM Usage: deploy.bat

echo 🚀 Bắt đầu quá trình deploy WebSolar...

REM Get project directory
set PROJECT_DIR=C:\www\websolar
set BACKEND_DIR=%PROJECT_DIR%\backend
set FRONTEND_DIR=%PROJECT_DIR%\frontend
set WEB_ROOT=C:\inetpub\wwwroot

REM Check if project directory exists
if not exist "%PROJECT_DIR%" (
    echo ❌ Thư mục dự án không tồn tại: %PROJECT_DIR%
    echo Vui lòng clone repository trước:
    echo   git clone your-repo-url %PROJECT_DIR%
    exit /b 1
)

cd /d %PROJECT_DIR%

REM Pull latest code
echo 📥 Đang pull code mới từ Git...
git pull origin main
if errorlevel 1 (
    git pull origin master
)

REM Backend deployment
echo 📦 Đang cập nhật Backend...
cd /d %BACKEND_DIR%

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  File .env chưa tồn tại. Đang tạo từ .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ⚠️  Vui lòng chỉnh sửa file .env với thông tin thực tế!
    )
)

REM Install dependencies
echo Đang cài đặt dependencies...
call npm install --production

REM Create images directory
if not exist "images" mkdir images

REM Restart PM2
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    echo Đang restart PM2...
    pm2 restart websolar-backend
    if errorlevel 1 (
        pm2 start ecosystem.config.js
    )
    pm2 save
) else (
    echo ⚠️  PM2 chưa được cài đặt. Cài đặt: npm install -g pm2
)

REM Frontend deployment
echo 📦 Đang cập nhật Frontend...
cd /d %FRONTEND_DIR%

REM Check if .env.production exists
if not exist ".env.production" (
    echo ⚠️  File .env.production chưa tồn tại. Đang tạo từ .env.production.example...
    if exist ".env.production.example" (
        copy ".env.production.example" ".env.production"
        echo ⚠️  Vui lòng chỉnh sửa file .env.production với VITE_API_URL thực tế!
    )
)

REM Install dependencies
echo Đang cài đặt dependencies...
call npm install

REM Build
echo Đang build frontend...
call npm run build

REM Copy to web root
if exist "dist" (
    echo Đang copy files vào web root...
    if not exist "%WEB_ROOT%" mkdir "%WEB_ROOT%"
    xcopy /E /Y "dist\*" "%WEB_ROOT%\"
    echo ✅ Files đã được copy vào %WEB_ROOT%
) else (
    echo ❌ Thư mục dist không tồn tại. Build có thể đã thất bại.
    exit /b 1
)

REM Restart IIS (if using IIS)
sc query W3SVC >nul 2>&1
if %errorlevel% equ 0 (
    echo Đang restart IIS...
    iisreset
)

echo ✅ Deploy hoàn tất!
echo.
echo 📋 Kiểm tra:
echo   - Backend: pm2 status
echo   - Frontend: Truy cập domain của bạn
echo   - Logs: pm2 logs websolar-backend

pause

