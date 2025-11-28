# Quick Start - Triển khai nhanh trên Windows Server

## 🎯 IP Server: 103.56.162.112

## 📋 Checklist nhanh

### Bước 1: Cài đặt (Lần đầu tiên)
- [ ] Node.js 18.x
- [ ] Git for Windows
- [ ] PM2: `npm install -g pm2 pm2-windows-startup`
- [ ] IIS (tùy chọn)

### Bước 2: Clone code
```cmd
cd C:\
mkdir www
cd www
git clone https://github.com/dnam1604-hue/websolar.git websolar
cd websolar
```

### Bước 3: Backend
```cmd
cd C:\www\websolar\backend
copy .env.example .env
notepad .env
```
**Điền vào .env:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/websolar?retryWrites=true&w=majority
```

```cmd
npm install --production
mkdir images
pm2 start ecosystem.config.js
pm2 save
```

### Bước 4: Frontend
```cmd
cd C:\www\websolar\frontend
copy .env.production.example .env.production
notepad .env.production
```
**Điền vào .env.production:**
```env
VITE_API_URL=http://103.56.162.112:5000
```

```cmd
npm install
npm run build
xcopy /E /Y dist\* C:\inetpub\wwwroot\
```

### Bước 5: Firewall
```cmd
netsh advfirewall firewall add rule name="Node.js Backend" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="HTTP" dir=in action=allow protocol=TCP localport=80
```

### Bước 6: Cấu hình IIS
1. Mở IIS Manager
2. Add Website:
   - Site name: `websolar`
   - Physical path: `C:\inetpub\wwwroot`
   - Binding: Port 80, Host name: (để trống)
3. Cài URL Rewrite Module
4. Tạo `web.config` trong `C:\inetpub\wwwroot\` (xem DEPLOYMENT.md)

## ✅ Kiểm tra

- Backend: `http://103.56.162.112:5000`
- Frontend: `http://103.56.162.112`
- PM2 status: `pm2 status`
- PM2 logs: `pm2 logs websolar-backend`

## 🔄 Cập nhật code (Khi có thay đổi)

```cmd
cd C:\www\websolar
deploy.bat
```

Hoặc thủ công:
```cmd
git pull origin main
cd backend
npm install --production
pm2 restart websolar-backend
cd ..\frontend
npm install
npm run build
xcopy /E /Y dist\* C:\inetpub\wwwroot\
```

---

**Xem hướng dẫn chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md)**

