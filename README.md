# WebSolar Project

Dự án web full-stack sử dụng React cho frontend và Node.js/Express cho backend.

## Cấu trúc dự án

```
websolar/
├── frontend/          # React Frontend
├── backend/           # Node.js/Express Backend
├── .gitignore
└── README.md
```

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- npm hoặc yarn
- MongoDB (nếu sử dụng database)

## Cài đặt và chạy

### Frontend

1. Di chuyển vào thư mục frontend:
```cmd
cd frontend
```

2. Cài đặt dependencies:
```cmd
npm install
```

3. Chạy ứng dụng:
```cmd
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### Backend

1. Di chuyển vào thư mục backend:
```cmd
cd backend
```

2. Cài đặt dependencies:
```cmd
npm install
```

3. Tạo file `.env` và cấu hình:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/websolar
```

4. Chạy server:
```cmd
REM Development mode (với nodemon)
npm run dev

REM Production mode
npm start
```

Backend sẽ chạy tại: http://localhost:5000

## API Endpoints

### Test
- `GET /api/test` - Kiểm tra API hoạt động

### Examples
- `GET /api/examples` - Lấy tất cả examples
- `POST /api/examples` - Tạo example mới
- `GET /api/examples/:id` - Lấy example theo ID
- `PUT /api/examples/:id` - Cập nhật example
- `DELETE /api/examples/:id` - Xóa example

## Công nghệ sử dụng

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS

## Phát triển

### Thêm tính năng mới

1. **Frontend**: Thêm components trong `frontend/src/components/`
2. **Backend**: Thêm routes trong `backend/routes/`, controllers trong `backend/controllers/`

### Database

Dự án sử dụng MongoDB với Mongoose ODM. Để kết nối database, cấu hình `MONGODB_URI` trong file `.env` của backend.

## 📦 Triển khai (Deployment)

Xem file [DEPLOYMENT.md](./DEPLOYMENT.md) để biết hướng dẫn chi tiết triển khai lên Windows Server.

### Tóm tắt nhanh:

1. **Chuẩn bị file môi trường:**
   - Backend: Copy `backend/.env.example` → `backend/.env` và điền thông tin
   - Frontend: Copy `frontend/.env.production.example` → `frontend/.env.production` và điền `VITE_API_URL`

2. **Trên Windows Server:**
   ```cmd
   git clone your-repo-url C:\www\websolar
   cd C:\www\websolar
   deploy.bat  # Hoặc deploy.ps1, hoặc làm thủ công theo DEPLOYMENT.md
   ```

3. **Cấu hình IIS** theo hướng dẫn trong `DEPLOYMENT.md`
   - Có thể dùng IP address nếu chưa có domain
   - SSL chỉ cần khi có domain

## 📁 Cấu trúc File Deployment

- `backend/.env.example` - Mẫu file cấu hình backend
- `frontend/.env.production.example` - Mẫu file cấu hình frontend production
- `backend/ecosystem.config.js` - Cấu hình PM2 cho backend (Windows paths)
- `deploy.ps1` - Script tự động deploy (PowerShell)
- `deploy.bat` - Script tự động deploy (Batch)
- `DEPLOYMENT.md` - Hướng dẫn chi tiết triển khai Windows Server

## License

MIT


