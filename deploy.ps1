# WebSolar Deployment Script for Windows Server
# Usage: .\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Bắt đầu quá trình deploy WebSolar..." -ForegroundColor Cyan

# Colors
$GREEN = "Green"
$YELLOW = "Yellow"
$RED = "Red"

# Get project directory
$PROJECT_DIR = "C:\www\websolar"
$BACKEND_DIR = "$PROJECT_DIR\backend"
$FRONTEND_DIR = "$PROJECT_DIR\frontend"
$WEB_ROOT = "C:\inetpub\wwwroot"

# Check if project directory exists
if (-not (Test-Path $PROJECT_DIR)) {
    Write-Host "❌ Thư mục dự án không tồn tại: $PROJECT_DIR" -ForegroundColor $RED
    Write-Host "Vui lòng clone repository trước:" -ForegroundColor $YELLOW
    Write-Host "  git clone your-repo-url $PROJECT_DIR" -ForegroundColor $YELLOW
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
    } else {
        Write-Host "❌ Không tìm thấy .env.example" -ForegroundColor $RED
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
    Write-Host "Đang restart PM2..." -ForegroundColor $YELLOW
    pm2 restart websolar-backend
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  PM2 app chưa tồn tại. Đang start..." -ForegroundColor $YELLOW
        pm2 start ecosystem.config.js
    }
    pm2 save
} else {
    Write-Host "⚠️  PM2 chưa được cài đặt. Backend sẽ không tự động restart." -ForegroundColor $YELLOW
    Write-Host "Cài đặt PM2: npm install -g pm2" -ForegroundColor $YELLOW
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
    } else {
        Write-Host "❌ Không tìm thấy .env.production.example" -ForegroundColor $RED
    }
}

# Install dependencies
Write-Host "Đang cài đặt dependencies..." -ForegroundColor $YELLOW
npm install

# Build
Write-Host "Đang build frontend..." -ForegroundColor $YELLOW
npm run build

# Copy to web root
if (Test-Path "dist") {
    Write-Host "Đang copy files vào web root..." -ForegroundColor $YELLOW
    
    # Create web root if not exists
    if (-not (Test-Path $WEB_ROOT)) {
        New-Item -ItemType Directory -Path $WEB_ROOT -Force | Out-Null
    }
    
    # Copy files
    Copy-Item -Path "dist\*" -Destination $WEB_ROOT -Recurse -Force
    
    Write-Host "✅ Files đã được copy vào $WEB_ROOT" -ForegroundColor $GREEN
} else {
    Write-Host "❌ Thư mục dist không tồn tại. Build có thể đã thất bại." -ForegroundColor $RED
    exit 1
}

# Restart IIS (if using IIS)
if (Get-Service -Name W3SVC -ErrorAction SilentlyContinue) {
    Write-Host "Đang restart IIS..." -ForegroundColor $YELLOW
    iisreset
}

Write-Host "✅ Deploy hoàn tất!" -ForegroundColor $GREEN
Write-Host ""
Write-Host "📋 Kiểm tra:" -ForegroundColor $YELLOW
Write-Host "  - Backend: pm2 status" -ForegroundColor $YELLOW
Write-Host "  - Frontend: Truy cập domain của bạn" -ForegroundColor $YELLOW
Write-Host "  - Logs: pm2 logs websolar-backend" -ForegroundColor $YELLOW

