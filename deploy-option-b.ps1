# WebSolar Deployment Script for Option B (Node.js Server)
# Usage: .\deploy-option-b.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Bắt đầu quá trình deploy WebSolar (Option B)..." -ForegroundColor Cyan

# Colors
$GREEN = "Green"
$YELLOW = "Yellow"
$RED = "Red"

# Get project directory
$PROJECT_DIR = "C:\www\websolar"
$BACKEND_DIR = "$PROJECT_DIR\backend"
$FRONTEND_DIR = "$PROJECT_DIR\frontend"
$FRONTEND_DIST = "$FRONTEND_DIR\dist"

# Check if project directory exists
if (-not (Test-Path $PROJECT_DIR)) {
    Write-Host "❌ Thư mục dự án không tồn tại: $PROJECT_DIR" -ForegroundColor $RED
    exit 1
}

Set-Location $PROJECT_DIR

# Pull latest code
Write-Host "📥 Đang pull code mới từ Git..." -ForegroundColor $YELLOW
try {
    git pull origin main
} catch {
    try {
        git pull origin master
    } catch {
        Write-Host "⚠️  Không thể pull code. Kiểm tra kết nối Git." -ForegroundColor $YELLOW
    }
}

# Backend deployment
Write-Host "📦 Đang cập nhật Backend..." -ForegroundColor $YELLOW
Set-Location $BACKEND_DIR

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  File .env chưa tồn tại. Đang tạo từ .env.example..." -ForegroundColor $YELLOW
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "⚠️  Vui lòng chỉnh sửa file .env với thông tin thực tế!" -ForegroundColor $YELLOW
    }
}

# Install dependencies
Write-Host "Đang cài đặt dependencies..." -ForegroundColor $YELLOW
npm install --production

# Create images directory if not exists
if (-not (Test-Path "images")) {
    New-Item -ItemType Directory -Path "images" | Out-Null
}

# Restart PM2
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    Write-Host "Đang restart PM2 backend..." -ForegroundColor $YELLOW
    pm2 restart websolar-backend
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Backend chưa chạy. Đang start..." -ForegroundColor $YELLOW
        pm2 start ecosystem.config.js
    }
    pm2 save
} else {
    Write-Host "❌ PM2 chưa được cài đặt. Cài đặt: npm install -g pm2" -ForegroundColor $RED
    exit 1
}

# Frontend deployment
Write-Host "📦 Đang cập nhật Frontend..." -ForegroundColor $YELLOW
Set-Location $FRONTEND_DIR

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  File .env.production chưa tồn tại. Đang tạo từ .env.production.example..." -ForegroundColor $YELLOW
    if (Test-Path ".env.production.example") {
        Copy-Item ".env.production.example" ".env.production"
        Write-Host "⚠️  Vui lòng chỉnh sửa file .env.production với VITE_API_URL thực tế!" -ForegroundColor $YELLOW
    }
}

# Install dependencies
Write-Host "Đang cài đặt dependencies..." -ForegroundColor $YELLOW
npm install

# Build
Write-Host "Đang build frontend..." -ForegroundColor $YELLOW
npm run build

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Thư mục dist không tồn tại. Build có thể đã thất bại." -ForegroundColor $RED
    exit 1
}

# Ensure server.js exists in dist folder
Set-Location $FRONTEND_DIST
if (-not (Test-Path "server.js")) {
    Write-Host "⚠️  File server.js không tồn tại trong dist. Đang tạo..." -ForegroundColor $YELLOW
    
    $serverJsContent = @"
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// API proxy
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  }
}));

// React Router - serve index.html for all non-API routes
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Check if it's a file request (has extension)
  if (req.path.includes('.')) {
    return next();
  }
  
  // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`);
});
"@
    
    Set-Content -Path "server.js" -Value $serverJsContent
    Write-Host "✅ Đã tạo file server.js" -ForegroundColor $GREEN
}

# Check if node_modules exists in dist
if (-not (Test-Path "node_modules")) {
    Write-Host "Đang cài đặt dependencies cho frontend server..." -ForegroundColor $YELLOW
    npm init -y | Out-Null
    npm install express http-proxy-middleware
}

# Restart frontend PM2
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    Write-Host "Đang restart PM2 frontend..." -ForegroundColor $YELLOW
    pm2 restart websolar-frontend
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Frontend chưa chạy. Đang start..." -ForegroundColor $YELLOW
        pm2 start server.js --name websolar-frontend
    }
    pm2 save
} else {
    Write-Host "❌ PM2 chưa được cài đặt." -ForegroundColor $RED
    exit 1
}

Write-Host ""
Write-Host "✅ Deploy hoàn tất!" -ForegroundColor $GREEN
Write-Host ""
Write-Host "📋 Kiểm tra:" -ForegroundColor $YELLOW
Write-Host "  - Backend: pm2 status" -ForegroundColor $YELLOW
Write-Host "  - Frontend: http://103.56.162.112:3000" -ForegroundColor $YELLOW
Write-Host "  - Logs: pm2 logs websolar-backend" -ForegroundColor $YELLOW
Write-Host "  - Logs Frontend: pm2 logs websolar-frontend" -ForegroundColor $YELLOW
Write-Host ""

