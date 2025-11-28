# Hướng Dẫn Test WebSolar Project

## 📋 Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt và Khởi Động](#cài-đặt-và-khởi-động)
3. [Test Backend API](#test-backend-api)
4. [Test Frontend](#test-frontend)
5. [Test Tích Hợp](#test-tích-hợp)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Yêu Cầu Hệ Thống

- Node.js (v14 trở lên)
- MongoDB (Local hoặc Atlas)
- npm hoặc yarn
- Postman hoặc Thunder Client (để test API)

---

## 🚀 Cài Đặt và Khởi Động

### 1. Cài Đặt MongoDB

**Option A: MongoDB Local**
```bash
# Windows: Tải và cài đặt từ mongodb.com
# Hoặc sử dụng Docker:
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option B: MongoDB Atlas (Cloud)**
- Truy cập: https://www.mongodb.com/cloud/atlas
- Tạo cluster miễn phí
- Lấy connection string
- Cập nhật `MONGODB_URI` trong `backend/.env`

### 2. Cài Đặt Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Cấu Hình Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/websolar
```

**Frontend (`frontend/.env` - tùy chọn):**
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Khởi Động Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Kết quả mong đợi:**
- Backend: `Server đang chạy tại http://localhost:5000`
- Backend: `✅ MongoDB Connected: localhost`
- Frontend: Tự động mở `http://localhost:3000`

---

## 🧪 Test Backend API

### 1. Test Connection

**GET** `http://localhost:5000/`
```json
{
  "message": "WebSolar Backend API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "news": "/api/news",
    "stations": "/api/stations",
    "products": "/api/products",
    "contacts": "/api/contacts"
  }
}
```

**GET** `http://localhost:5000/api/test`
```json
{
  "message": "API đang hoạt động!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "success"
}
```

### 2. Test News API

**Tạo tin tức mới:**
```bash
POST http://localhost:5000/api/news
Content-Type: application/json

{
  "title": "Khai trương trạm sạc mới",
  "summary": "Trạm sạc mới tại Thủ Đức",
  "link": "https://example.com",
  "status": "published"
}
```

**Lấy danh sách tin tức:**
```bash
GET http://localhost:5000/api/news
GET http://localhost:5000/api/news?status=published
```

**Lấy tin tức theo ID:**
```bash
GET http://localhost:5000/api/news/{id}
```

**Cập nhật tin tức:**
```bash
PUT http://localhost:5000/api/news/{id}
Content-Type: application/json

{
  "title": "Tiêu đề đã cập nhật",
  "summary": "Tóm tắt đã cập nhật"
}
```

**Xóa tin tức:**
```bash
DELETE http://localhost:5000/api/news/{id}
```

### 3. Test Stations API

**Tạo trạm sạc mới:**
```bash
POST http://localhost:5000/api/stations
Content-Type: application/json

{
  "name": "SolarEV Hub - Nam Long",
  "address": "01 Đường 48, KDC Nam Long, TP. Thủ Đức",
  "power": "AC 22kW / DC 60kW",
  "status": "Hoạt động",
  "location": {
    "latitude": 10.762622,
    "longitude": 106.660172
  }
}
```

**Lấy danh sách trạm sạc:**
```bash
GET http://localhost:5000/api/stations
GET http://localhost:5000/api/stations?status=Hoạt động
```

### 4. Test Products API

**Tạo sản phẩm mới:**
```bash
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "Trụ sạc DC 150kW",
  "description": "Giải pháp cho cao tốc và depot",
  "price": "Liên hệ",
  "category": "DC",
  "status": "active"
}
```

**Lấy danh sách sản phẩm:**
```bash
GET http://localhost:5000/api/products
GET http://localhost:5000/api/products?category=DC
GET http://localhost:5000/api/products?status=active
```

### 5. Test Contacts API

**Gửi form liên hệ:**
```bash
POST http://localhost:5000/api/contacts
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "type": "Tư vấn lắp đặt",
  "message": "Tôi muốn tư vấn về việc lắp đặt trạm sạc"
}
```

**Lấy danh sách liên hệ (Admin):**
```bash
GET http://localhost:5000/api/contacts
GET http://localhost:5000/api/contacts?status=new
GET http://localhost:5000/api/contacts?type=Tư vấn lắp đặt
```

---

## 🎨 Test Frontend

### 1. Test Home Page

**URL:** `http://localhost:3000`

**Kiểm tra:**
- ✅ Trang chủ load thành công
- ✅ Hiển thị hero section
- ✅ Hiển thị các sections (services, features, etc.)
- ✅ CMS section hiển thị dữ liệu từ database (nếu có)
- ✅ Nút "Đặt lịch tư vấn" link đến `/contact`

### 2. Test Admin Dashboard

**URL:** `http://localhost:3000/admin`

**Test thêm tin tức:**
1. Điền form "Thêm tin tức"
2. Click "Lưu tin tức"
3. Kiểm tra:
   - ✅ Thông báo thành công hiển thị
   - ✅ Form được reset
   - ✅ Tin tức xuất hiện trong "Tin tức gần đây"
   - ✅ Dữ liệu được lưu vào MongoDB

**Test thêm trạm sạc:**
1. Điền form "Thêm trạm sạc"
2. Click "Lưu trạm sạc"
3. Kiểm tra tương tự như trên

**Test thêm sản phẩm:**
1. Điền form "Thêm sản phẩm/dịch vụ"
2. Click "Lưu sản phẩm"
3. Kiểm tra tương tự như trên

**Test tải lại dữ liệu:**
1. Click "Tải lại dữ liệu"
2. Kiểm tra dữ liệu được refresh từ database

### 3. Test Contact Form

**URL:** `http://localhost:3000/contact`

**Test validation:**
1. Submit form trống → Kiểm tra hiển thị lỗi validation
2. Nhập email không hợp lệ → Kiểm tra lỗi email
3. Nhập số điện thoại không hợp lệ → Kiểm tra lỗi phone
4. Nhập message < 10 ký tự → Kiểm tra lỗi message

**Test submit thành công:**
1. Điền đầy đủ thông tin hợp lệ
2. Click "Gửi yêu cầu"
3. Kiểm tra:
   - ✅ Thông báo thành công hiển thị
   - ✅ Form được reset
   - ✅ Dữ liệu được lưu vào MongoDB
   - ✅ Có thể xem trong Admin Dashboard hoặc API

### 4. Test Consultation Page

**URL:** `http://localhost:3000/consultation`

**Test form inline:**
1. Scroll xuống phần "Liên hệ tư vấn"
2. Click "Gửi yêu cầu tư vấn"
3. Form hiển thị inline
4. Test submit form tương tự như Contact page

### 5. Test Các Trang Khác

- ✅ `/app` - Trang ứng dụng
- ✅ `/stations` - Trang trạm sạc
- ✅ `/guide` - Trang hướng dẫn
- ✅ `/packages` - Trang gói sạc
- ✅ `/faq` - Trang FAQ

---

## 🔗 Test Tích Hợp

### 1. Test Flow Hoàn Chỉnh

**Scenario: Admin thêm nội dung → Hiển thị trên Home**

1. Vào `/admin`
2. Thêm tin tức mới
3. Vào `/` (Home page)
4. Kiểm tra tin tức mới xuất hiện trong CMS section

**Scenario: User gửi form liên hệ → Admin xem**

1. Vào `/contact`
2. Gửi form liên hệ
3. Vào `/admin` (hoặc gọi API `GET /api/contacts`)
4. Kiểm tra liên hệ mới xuất hiện

### 2. Test Error Handling

**Test Backend không chạy:**
1. Tắt backend server
2. Vào `/admin` và thử thêm nội dung
3. Kiểm tra hiển thị error message

**Test MongoDB không kết nối:**
1. Tắt MongoDB
2. Khởi động backend
3. Kiểm tra error log và thông báo lỗi

**Test API lỗi:**
1. Gửi request với dữ liệu không hợp lệ
2. Kiểm tra error response format

---

## 🐛 Troubleshooting

### Lỗi: "MongoDB connection error"

**Nguyên nhân:**
- MongoDB chưa được khởi động
- Connection string sai
- Port bị conflict

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
# Windows:
net start MongoDB

# Docker:
docker ps | grep mongo

# Kiểm tra connection string trong .env
```

### Lỗi: "Cannot GET /api/..."

**Nguyên nhân:**
- Backend chưa chạy
- Route chưa được định nghĩa
- Port không đúng

**Giải pháp:**
- Kiểm tra backend đang chạy tại port 5000
- Kiểm tra file `backend/routes/api.js`
- Kiểm tra console log của backend

### Lỗi: "Network Error" hoặc "CORS Error"

**Nguyên nhân:**
- Backend chưa chạy
- CORS chưa được cấu hình
- API URL sai

**Giải pháp:**
- Kiểm tra backend đang chạy
- Kiểm tra `backend/server.js` có `app.use(cors())`
- Kiểm tra `REACT_APP_API_URL` trong frontend

### Lỗi: "Module not found"

**Nguyên nhân:**
- Dependencies chưa được cài đặt
- Import path sai

**Giải pháp:**
```bash
# Cài đặt lại dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Lỗi: "Unexpected token" hoặc Syntax Error

**Nguyên nhân:**
- Code có lỗi syntax
- Babel chưa compile đúng

**Giải pháp:**
- Kiểm tra lỗi trong console
- Kiểm tra file có lỗi syntax
- Restart dev server

---

## ✅ Checklist Test

### Backend
- [ ] MongoDB kết nối thành công
- [ ] Server chạy tại port 5000
- [ ] Test endpoint hoạt động
- [ ] CRUD News hoạt động
- [ ] CRUD Stations hoạt động
- [ ] CRUD Products hoạt động
- [ ] CRUD Contacts hoạt động
- [ ] Error handling hoạt động đúng

### Frontend
- [ ] Home page load thành công
- [ ] Admin Dashboard load và hiển thị dữ liệu
- [ ] Thêm tin tức thành công
- [ ] Thêm trạm sạc thành công
- [ ] Thêm sản phẩm thành công
- [ ] Contact form validation hoạt động
- [ ] Contact form submit thành công
- [ ] Consultation page form hoạt động
- [ ] Tất cả routes hoạt động

### Tích Hợp
- [ ] Dữ liệu từ Admin hiển thị trên Home
- [ ] Form liên hệ lưu vào database
- [ ] Loading states hiển thị đúng
- [ ] Error messages hiển thị đúng
- [ ] Success messages hiển thị đúng

---

## 📝 Ghi Chú

- Luôn kiểm tra console log của browser và terminal
- Sử dụng Network tab trong DevTools để debug API calls
- Kiểm tra MongoDB Compass để xem dữ liệu trong database
- Test trên nhiều trình duyệt khác nhau (Chrome, Firefox, Edge)

---

## 🆘 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Console logs (browser và terminal)
2. Network requests trong DevTools
3. MongoDB connection status
4. Environment variables
5. File `.env` có đúng format không

---

**Chúc bạn test thành công! 🎉**

