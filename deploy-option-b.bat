@echo off
setlocal enabledelayedexpansion

echo 🚀 Bắt đầu quá trình deploy WebSolar (Option B)...

REM Get project directory
set PROJECT_DIR=C:\www\websolar
set BACKEND_DIR=%PROJECT_DIR%\backend
set FRONTEND_DIR=%PROJECT_DIR%\frontend
set FRONTEND_DIST=%FRONTEND_DIR%\dist

REM Check if project directory exists
if not exist "%PROJECT_DIR%" (
    echo ❌ Thư mục dự án không tồn tại: %PROJECT_DIR%
    exit /b 1
)

cd /d %PROJECT_DIR%

REM Pull latest code
echo 📥 Đang pull code mới từ Git...
git pull origin main || git pull origin master

REM Backend deployment
echo.
echo 📦 Đang cập nhật Backend...
cd /d %BACKEND_DIR%

if not exist ".env" (
    echo ⚠️  File .env chưa tồn tại. Đang tạo từ .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ⚠️  Vui lòng chỉnh sửa file .env với thông tin thực tế!
    )
)

echo Đang cài đặt dependencies...
call npm install --production
if errorlevel 1 (
    echo ⚠️  Có lỗi khi cài đặt dependencies backend, nhưng tiếp tục...
)

if not exist "images" mkdir images

where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    echo Đang restart PM2 backend...
    pm2 restart websolar-backend || pm2 start ecosystem.config.js
    pm2 save
    echo ✅ Backend đã được restart
) else (
    echo ❌ PM2 chưa được cài đặt. Cài đặt: npm install -g pm2
    exit /b 1
)

REM Return to project directory before continuing
cd /d %PROJECT_DIR%

REM Frontend deployment
echo.
echo ========================================
echo 📦 Đang cập nhật Frontend...
echo ========================================
cd /d %FRONTEND_DIR%
if errorlevel 1 (
    echo ❌ Không thể chuyển đến thư mục frontend: %FRONTEND_DIR%
    exit /b 1
)

if not exist ".env.production" (
    echo ⚠️  File .env.production chưa tồn tại. Đang tạo từ .env.production.example...
    if exist ".env.production.example" (
        copy ".env.production.example" ".env.production"
        echo ⚠️  Vui lòng chỉnh sửa file .env.production với VITE_API_URL thực tế!
    )
)

echo Đang cài đặt dependencies frontend...
call npm install
if errorlevel 1 (
    echo ❌ Lỗi khi cài đặt dependencies frontend!
    exit /b 1
)

echo Đang build frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Lỗi khi build frontend!
    exit /b 1
)

if not exist "dist" (
    echo ❌ Thư mục dist không tồn tại. Build có thể đã thất bại.
    exit /b 1
)

echo ✅ Build frontend thành công!

REM Ensure server.js exists in dist folder
cd /d %FRONTEND_DIST%
if not exist "server.js" (
    echo ⚠️  File server.js không tồn tại trong dist. Đang tạo...
    (
        echo const express = require^('express'^);
        echo const path = require^('path'^);
        echo const { createProxyMiddleware } = require^('http-proxy-middleware'^);
        echo const app = express^(^);
        echo const PORT = process.env.PORT ^|^| 3000;
        echo.
        echo // Serve static files
        echo app.use^(express.static^(path.join^(__dirname^)^)^);
        echo.
        echo // API proxy
        echo app.use^('/api', createProxyMiddleware^({
        echo   target: 'http://localhost:5000',
        echo   changeOrigin: true,
        echo   pathRewrite: {
        echo     '^/api': '/api'
        echo   }
        echo }^)^);
        echo.
        echo // React Router - serve index.html for all non-API routes
        echo app.use^((req, res, next^) =^> {
        echo   // Skip API routes
        echo   if ^(req.path.startsWith^('/api'^)^) {
        echo     return next^(^);
        echo   }
        echo   // Check if it's a file request ^(has extension^)
        echo   if ^(req.path.includes^('.'^)^) {
        echo     return next^(^);
        echo   }
        echo   // Serve index.html for all other routes
        echo   res.sendFile^(path.join^(__dirname, 'index.html'^)^);
        echo }^);
        echo.
        echo app.listen^(PORT, '0.0.0.0', ^(^) =^> {
        echo   console.log^(`Frontend server running on http://0.0.0.0:${PORT}`^);
        echo }^);
    ) > server.js
    echo ✅ Đã tạo file server.js
)

if not exist "node_modules" (
    echo Đang cài đặt dependencies cho frontend server...
    call npm init -y
    call npm install express http-proxy-middleware
)

REM Restart frontend PM2
echo.
echo Đang restart PM2 frontend...
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 restart websolar-frontend
    if errorlevel 1 (
        echo ⚠️  Frontend chưa chạy. Đang start...
        pm2 start server.js --name websolar-frontend --cwd %FRONTEND_DIST%
    )
    pm2 save
    echo ✅ Frontend đã được restart
) else (
    echo ❌ PM2 chưa được cài đặt.
    exit /b 1
)

echo.
echo ✅ Deploy hoàn tất!
echo.
echo 📋 Kiểm tra:
echo   - Backend: pm2 status
echo   - Frontend: http://103.56.162.112:3000
echo   - Logs: pm2 logs websolar-backend
echo   - Logs Frontend: pm2 logs websolar-frontend
echo.

pause