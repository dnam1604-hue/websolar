# API Endpoints Documentation

## Base URL
`http://localhost:5000/api`

---

## Test
- **GET** `/test` - Kiểm tra API hoạt động

---

## News (Tin tức)

- **GET** `/news` - Lấy tất cả tin tức
  - Query params: `?status=published` (optional)
  
- **GET** `/news/:id` - Lấy tin tức theo ID

- **POST** `/news` - Tạo tin tức mới
  ```json
  {
    "title": "Tiêu đề tin tức",
    "summary": "Tóm tắt tin tức",
    "link": "https://example.com",
    "status": "published" // optional: "draft" | "published"
  }
  ```

- **PUT** `/news/:id` - Cập nhật tin tức

- **DELETE** `/news/:id` - Xóa tin tức

---

## Stations (Trạm sạc)

- **GET** `/stations` - Lấy tất cả trạm sạc
  - Query params: `?status=Hoạt động` (optional)

- **GET** `/stations/:id` - Lấy trạm sạc theo ID

- **POST** `/stations` - Tạo trạm sạc mới
  ```json
  {
    "name": "Tên trạm",
    "address": "Địa chỉ trạm",
    "power": "AC 22kW / DC 60kW",
    "status": "Hoạt động", // "Hoạt động" | "Bảo trì" | "Sắp khai trương"
    "location": {
      "latitude": 10.762622,
      "longitude": 106.660172
    },
    "description": "Mô tả" // optional
  }
  ```

- **PUT** `/stations/:id` - Cập nhật trạm sạc

- **DELETE** `/stations/:id` - Xóa trạm sạc

---

## Products (Sản phẩm/Dịch vụ)

- **GET** `/products` - Lấy tất cả sản phẩm
  - Query params: 
    - `?category=DC` (optional: "DC" | "AC" | "Portable" | "Other")
    - `?status=active` (optional: "active" | "inactive")

- **GET** `/products/:id` - Lấy sản phẩm theo ID

- **POST** `/products` - Tạo sản phẩm mới
  ```json
  {
    "name": "Tên sản phẩm",
    "description": "Mô tả sản phẩm",
    "price": "499K/tháng hoặc Liên hệ",
    "category": "DC", // "DC" | "AC" | "Portable" | "Other"
    "status": "active", // optional: "active" | "inactive"
    "image": "https://example.com/image.jpg" // optional
  }
  ```

- **PUT** `/products/:id` - Cập nhật sản phẩm

- **DELETE** `/products/:id` - Xóa sản phẩm

---

## Contacts (Liên hệ)

- **GET** `/contacts` - Lấy tất cả liên hệ (cho admin)
  - Query params:
    - `?status=new` (optional: "new" | "contacted" | "resolved")
    - `?type=Tư vấn lắp đặt` (optional)

- **GET** `/contacts/:id` - Lấy liên hệ theo ID

- **POST** `/contacts` - Tạo liên hệ mới (public endpoint)
  ```json
  {
    "name": "Họ tên",
    "email": "email@example.com",
    "phone": "0123456789",
    "type": "Tư vấn lắp đặt", // "Tư vấn lắp đặt" | "Hợp tác" | "Hỗ trợ kỹ thuật" | "Khác"
    "message": "Nội dung tin nhắn"
  }
  ```

- **PUT** `/contacts/:id` - Cập nhật trạng thái liên hệ (cho admin)
  ```json
  {
    "status": "contacted", // "new" | "contacted" | "resolved"
    "notes": "Ghi chú" // optional
  }
  ```

- **DELETE** `/contacts/:id` - Xóa liên hệ

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10 // (only for GET all endpoints)
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

