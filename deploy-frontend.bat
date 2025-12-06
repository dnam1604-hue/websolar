@echo off
setlocal enabledelayedexpansion

echo  Bat dau deploy Frontend...

REM Get project directory
set PROJECT_DIR=C:\www\websolar
set FRONTEND_DIR=%PROJECT_DIR%\frontend
set FRONTEND_DIST=%FRONTEND_DIR%\dist

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

REM Frontend deployment
echo.
echo ========================================
echo  Dang cap nhat Frontend...
echo ========================================
cd /d %FRONTEND_DIR%
if errorlevel 1 (
    echo  Khong the chuyen den thu muc frontend: %FRONTEND_DIR%
    exit /b 1
)

if not exist ".env.production" (
    echo   File .env.production chua ton tai. Dang tao tu .env.production.example...
    if exist ".env.production.example" (
        copy ".env.production.example" ".env.production"
        echo   Vui long chinh sua file .env.production voi VITE_API_URL thuc te!
    )
)

echo Dang cai dat dependencies frontend...
call npm install
if errorlevel 1 (
    echo  Loi khi cai dat dependencies frontend!
    exit /b 1
)

echo Dang build frontend...
call npm run build
if errorlevel 1 (
    echo  Loi khi build frontend!
    exit /b 1
)

if not exist "dist" (
    echo  Thu muc dist khong ton tai. Build co the da that bai.
    exit /b 1
)

echo  Build frontend thanh cong!

REM Ensure server.js exists in dist folder
cd /d %FRONTEND_DIST%
if not exist "server.js" (
    echo   File server.js khong ton tai trong dist. Dang tao...
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
    echo  Da tao file server.js
)

if not exist "node_modules" (
    echo Dang cai dat dependencies cho frontend server...
    call npm init -y
    call npm install express http-proxy-middleware
)

REM Restart frontend PM2
echo.
echo Dang restart PM2 frontend...
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 restart websolar-frontend
    if errorlevel 1 (
        echo   Frontend chua chay. Dang start...
        pm2 start server.js --name websolar-frontend --cwd %FRONTEND_DIST%
    )
    pm2 save
    echo  Frontend da duoc restart
) else (
    echo  PM2 chua duoc cai dat.
    exit /b 1
)

echo.
echo  Deploy Frontend hoan tat!
echo.
echo  Kiem tra:
echo   - Frontend: http://103.56.162.112:3000
echo   - Logs Frontend: pm2 logs websolar-frontend
echo.

pause

