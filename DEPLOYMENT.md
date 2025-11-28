# Hướng dẫn Triển khai WebSolar lên Windows Server

Tài liệu này hướng dẫn cách triển khai dự án WebSolar lên Windows Server.

> **Lưu ý:** Dự án này được cấu hình để chạy trên Windows Server. Tất cả các script và hướng dẫn đều dành cho môi trường Windows.

## 📋 Yêu cầu

- Windows Server 2016+ hoặc Windows 10/11
- Node.js 18.x trở lên
- Git for Windows
- MongoDB Atlas (Cloud - Khuyến nghị) hoặc MongoDB local
- IIS (Internet Information Services) - Tùy chọn
- PM2 for Windows - Tùy chọn
- **Domain name (Tùy chọn)** - Có thể dùng IP address nếu chưa có domain

## 🚀 Bước 1: Chuẩn bị Windows Server

### 1.1. Cài đặt Node.js

1. Tải Node.js từ [nodejs.org](https://nodejs.org/)
2. Cài đặt Node.js (chọn LTS version)
3. Kiểm tra:
   ```cmd
   node --version
   npm --version
   ```

### 1.2. Cài đặt Git

1. Tải Git từ [git-scm.com](https://git-scm.com/download/win)
2. Cài đặt Git for Windows
3. Kiểm tra:
   ```cmd
   git --version
   ```

### 1.3. Cài đặt MongoDB (Nếu dùng local)

**Khuyến nghị: Sử dụng MongoDB Atlas (Cloud)**

Nếu muốn cài MongoDB local:
1. Tải MongoDB từ [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Cài đặt MongoDB Community Server
3. Khởi động MongoDB Service:
   ```cmd
   net start MongoDB
   ```

### 1.4. Cài đặt PM2 (Process Manager)

```cmd
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install
```

### 1.5. Cài đặt IIS (Tùy chọn - Nếu dùng IIS)

1. Mở **Server Manager**
2. **Add Roles and Features**
3. Chọn **Web Server (IIS)**
4. Cài đặt các features cần thiết

## 📥 Bước 2: Clone Repository

```cmd
cd C:\
mkdir www
cd www
git clone your-repository-url websolar
cd websolar
```

## ⚙️ Bước 3: Cấu hình Backend

### 3.1. Tạo file .env

```cmd
cd C:\www\websolar\backend
copy .env.example .env
notepad .env
```

Chỉnh sửa các giá trị:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/websolar?retryWrites=true&w=majority
```

### 3.2. Cài đặt dependencies

```cmd
npm install --production
```

### 3.3. Tạo thư mục images

```cmd
mkdir images
```

### 3.4. Cập nhật ecosystem.config.js

Sửa đường dẫn trong `ecosystem.config.js`:
```javascript
cwd: 'C:\\www\\websolar\\backend',  // Đảm bảo đúng đường dẫn Windows
```

### 3.5. Khởi động với PM2

```cmd
cd C:\www\websolar\backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Kiểm tra:
```cmd
pm2 status
pm2 logs websolar-backend
```

## 🎨 Bước 4: Cấu hình Frontend

### 4.1. Tạo file .env.production

```cmd
cd C:\www\websolar\frontend
copy .env.production.example .env.production
notepad .env.production
```

Chỉnh sửa:
```env
# Nếu chưa có domain, dùng IP:
VITE_API_URL=http://103.56.162.112:5000

# Khi có domain, có thể đổi thành:
# VITE_API_URL=https://api.yourdomain.com
# Hoặc nếu cùng domain:
# VITE_API_URL=https://yourdomain.com
```

### 4.2. Build Frontend

```cmd
npm install
npm run build
```

### 4.3. Copy vào web root

**Option 1: Sử dụng IIS (C:\inetpub\wwwroot)**

```cmd
xcopy /E /Y C:\www\websolar\frontend\dist\* C:\inetpub\wwwroot\
```

**Option 2: Thư mục tùy chỉnh**

```cmd
mkdir C:\www\html
xcopy /E /Y C:\www\websolar\frontend\dist\* C:\www\html\
```

## 🌐 Bước 5: Cấu hình Web Server

### Option A: Sử dụng IIS

#### 5.1. Tạo Website trong IIS

1. Mở **IIS Manager**
2. Right-click **Sites** → **Add Website**
3. Điền thông tin:
   - **Site name**: websolar
   - **Physical path**: `C:\inetpub\wwwroot` (hoặc thư mục bạn chọn)
   - **Binding**: 
     - Port: 80
     - Host name: (Để trống nếu chưa có domain, hoặc nhập domain khi có)
     - IP address: All Unassigned (hoặc chọn IP cụ thể)

#### 5.2. Cấu hình URL Rewrite

1. Cài đặt [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Tạo file `web.config` trong web root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
            </rules>
        </rewrite>
        
        <!-- API Proxy -->
        <rewrite>
            <rules>
                <rule name="API Proxy" stopProcessing="true">
                    <match url="^api/(.*)" />
                    <action type="Rewrite" url="http://localhost:5000/api/{R:1}" />
                </action>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

#### 5.3. Cấu hình Application Request Routing (ARR)

1. Cài đặt [Application Request Routing](https://www.iis.net/downloads/microsoft/application-request-routing)
2. Cấu hình Reverse Proxy trong IIS Manager

### Option B: Sử dụng Node.js HTTP Server (Đơn giản hơn)

Tạo file `server.js` trong thư mục frontend/dist:

```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// API proxy
app.use('/api', (req, res) => {
  const proxy = require('http-proxy-middleware');
  proxy({
    target: 'http://localhost:5000',
    changeOrigin: true
  })(req, res);
});

// React Router - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
```

Chạy:
```cmd
cd C:\www\websolar\frontend\dist
npm init -y
npm install express http-proxy-middleware
node server.js
```

Hoặc dùng PM2:
```cmd
pm2 start server.js --name websolar-frontend
```

## 🌐 Bước 6: Cấu hình Domain (Tùy chọn - Có thể bỏ qua nếu chưa có)

### 6.1. Nếu chưa có domain (Dùng IP)

Bạn có thể truy cập website bằng IP address:
- Frontend: `http://103.56.162.112`
- Backend API: `http://103.56.162.112:5000`

**Lưu ý:** 
- Đảm bảo firewall đã mở port 80 và 5000
- Cập nhật `VITE_API_URL` trong `.env.production` thành `http://103.56.162.112:5000`
- IP server hiện tại: **103.56.162.112**

### 6.2. Khi có domain (Cấu hình sau)

1. **Mua domain** từ nhà cung cấp (Namecheap, GoDaddy, Cloudflare, etc.)
2. **Trỏ DNS** về IP server của bạn:
   - A record: `@` → `103.56.162.112`
   - A record: `www` → `103.56.162.112` (nếu muốn)
3. **Cập nhật cấu hình:**
   - Sửa `VITE_API_URL` trong `.env.production` thành domain mới
   - Cập nhật IIS binding với domain name
   - Cài SSL certificate (Bước 7)

## 🔒 Bước 7: Cài đặt SSL (Tùy chọn - Chỉ khi có domain)

**Lưu ý:** SSL chỉ cần khi bạn có domain. Nếu chỉ dùng IP, có thể bỏ qua bước này.

### Sử dụng Let's Encrypt với win-acme

1. Tải [win-acme](https://www.win-acme.com/)
2. Chạy và làm theo hướng dẫn

### Hoặc mua SSL certificate và cài trong IIS

## 🔄 Cập nhật Code (Khi có thay đổi)

### Cách 1: Sử dụng script PowerShell

```powershell
cd C:\www\websolar
.\deploy.ps1
```

**Lưu ý:** Nếu gặp lỗi execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Cách 2: Sử dụng script Batch

```cmd
cd C:\www\websolar
deploy.bat
```

### Cách 3: Thủ công

```cmd
cd C:\www\websolar
git pull origin main

REM Backend
cd backend
npm install --production
pm2 restart websolar-backend

REM Frontend
cd ..\frontend
npm install
npm run build
xcopy /E /Y dist\* C:\inetpub\wwwroot\
iisreset
```

## ✅ Kiểm tra

1. **Lấy IP Server của bạn:**
   ```cmd
   ipconfig
   ```
   Tìm **IPv4 Address** (ví dụ: 192.168.1.100 cho mạng nội bộ)
   - Nếu là VPS, IP public thường được cung cấp bởi nhà cung cấp hosting
   - Nếu là server nội bộ, dùng IP local

2. **Backend API:**
   ```cmd
   curl http://localhost:5000
   pm2 logs websolar-backend
   ```
   - Kiểm tra từ máy khác: `http://103.56.162.112:5000`

3. **Frontend:**
   - **Nếu chưa có domain:** Truy cập `http://103.56.162.112` (port 80) hoặc `http://103.56.162.112:3000` (nếu dùng Node.js server)
   - **Nếu có domain:** Truy cập `http://yourdomain.com`
   - Kiểm tra console browser (F12) để xem có lỗi không

4. **MongoDB:**
   - Kiểm tra connection trong backend logs
   - Hoặc dùng MongoDB Compass để kết nối

## 🐛 Troubleshooting

### PM2 không chạy
```cmd
pm2 logs
pm2 restart websolar-backend
pm2 delete websolar-backend
pm2 start ecosystem.config.js
```

### Port đã được sử dụng
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### IIS lỗi
- Kiểm tra Event Viewer
- Kiểm tra IIS logs: `C:\inetpub\logs\LogFiles`

### Quyền file
- Đảm bảo IIS_IUSRS có quyền đọc thư mục web root
- Đảm bảo user chạy PM2 có quyền ghi vào thư mục backend/images

## 📝 Lưu ý

- **Không commit file `.env`** lên Git
- **Backup database** thường xuyên
- **Monitor logs** để phát hiện lỗi sớm
- **Update dependencies** định kỳ
- **Windows Firewall**: Mở port 80, 443, 5000 (nếu cần)
- **Domain là tùy chọn**: Có thể chạy với IP address, thêm domain sau
- **IP Address**: Dùng IP public nếu muốn truy cập từ internet, hoặc IP local nếu chỉ dùng trong mạng nội bộ
- **Domain là tùy chọn**: Có thể chạy với IP address, thêm domain sau
- **IP Address**: Dùng IP public nếu muốn truy cập từ internet, hoặc IP local nếu chỉ dùng trong mạng nội bộ

## 🔧 Cấu hình Windows Firewall

**Quan trọng:** Mở các port này để có thể truy cập từ bên ngoài:

```cmd
netsh advfirewall firewall add rule name="Node.js Backend" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="HTTP" dir=in action=allow protocol=TCP localport=80
netsh advfirewall firewall add rule name="HTTPS" dir=in action=allow protocol=TCP localport=443
```

**IP server của bạn:**
- **IP Public:** `103.56.162.112`
- Đây là IP để truy cập từ internet
- Frontend sẽ chạy tại: `http://103.56.162.112`
- Backend API sẽ chạy tại: `http://103.56.162.112:5000`

---

**Chúc bạn deploy thành công trên Windows Server! 🚀**

