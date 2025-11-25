# 📊 Phân Tích Chi Tiết Các Services

## 1. 🔍 AUTOMATION - Kết Nối Với Services

### **Kết Nối Hiện Tại:**

#### ✅ **1. Backend Service (Port 5001)**

- **File**: `automation/one_automation_once.py`
- **URL**: `http://localhost:5001`
- **Endpoints sử dụng**:
  - `GET /health` - Health check
  - `POST /api/automation-result` - Gửi kết quả automation
- **Mục đích**: Gửi kết quả automation về backend

#### ✅ **2. Google Sheets API**

- **File**: `automation/google_sheets_config.py`
- **Service**: Google Sheets API (external)
- **Chức năng**:
  - Đọc/ghi config từ Google Sheets
  - Quản lý SLA rules
  - Logging automation results
- **Spreadsheet ID**: `17xjOqmZFMYT_Tt78_BARbwMYhDEyGcODNwxYbxNSWG8`

#### ✅ **3. FastAPI Bridge (Port 8000)**

- **File**: `automation/automation_bridge.py`
- **Port**: 8000
- **Chức năng**: Bridge để frontend gọi automation
- **Endpoints**:
  - `GET /health`
  - `POST /api/automation/start`
  - `GET /api/orders`
  - `GET /api/automation/status`

#### ❌ **KHÔNG kết nối với:**

- `backend/server.js` (port 3001) - WebSocket server
- `google-sheets-project/server.js` (port 3001) - Google Sheets API server
- `ai-service` (port 8000) - AI Service

### **Tóm Tắt Automation:**

```
automation/
├── one_automation_once.py → Backend (localhost:5001)
├── automation_bridge.py → FastAPI (port 8000) - Bridge cho frontend
├── google_sheets_config.py → Google Sheets API (external)
└── Không kết nối với backend/server.js hay google-sheets-project/server.js
```

---

## 2. 🖥️ BACKEND - `./backend/server.js`

### **Chức Năng Chính:**

#### **1. WebSocket Server**

- **Port**: 3001
- **Framework**: Express + Socket.IO
- **Chức năng**:
  - Real-time communication với frontend
  - WebSocket events:
    - `connection` - Client kết nối
    - `request_data` - Request real-time data
    - `ai_analysis` - Request AI analysis
    - `welcome` - Welcome message
    - `data_update` - Send data updates
    - `ai_result` - Send AI analysis results

#### **2. REST API Endpoints**

- `GET /health` - Health check
- `GET /api/status` - Service status

#### **3. Static File Serving**

- Serve React app từ `../build/`
- Fallback route: `app.get('*')` → serve `index.html`

### **Dependencies:**

```javascript
- express
- socket.io
- cors
- helmet
- morgan
```

### **Tóm Tắt Backend:**

```
backend/server.js
├── WebSocket Server (Socket.IO)
│   ├── Real-time data updates
│   └── AI analysis requests
├── REST API
│   ├── /health
│   └── /api/status
└── Static file serving (React app)
```

---

## 3. 📊 GOOGLE SHEETS PROJECT - `google-sheets-project/server.js`

### **Chức Năng Chính:**

#### **1. Authentication System**

- **Endpoint**: `POST /api/auth/login`
- **Chức năng**: User authentication với hardcoded users
- **Users**:
  - <admin@mia.vn> / admin123
  - <user@mia.vn> / user123
  - <test@mia.vn> / test123
  - <demo@mia.vn> / 123456
  - <manager@mia.vn> / manager123
  - <guest@mia.vn> / guest123

#### **2. Google Sheets API**

- `POST /api/sheets/read` - Đọc dữ liệu từ Sheets
- `POST /api/sheets/write` - Ghi dữ liệu vào Sheets
- `POST /api/sheets/append` - Append dữ liệu
- `POST /api/sheets/create` - Tạo sheet mới
- `POST /api/sheets/info` - Lấy thông tin spreadsheet

#### **3. Google Drive API**

- `POST /api/drive/upload` - Upload file
- `POST /api/drive/list` - List files
- `POST /api/drive/create-folder` - Tạo folder
- `POST /api/drive/delete` - Xóa file
- `POST /api/drive/share` - Share file
- `POST /api/drive/link` - Lấy file link

#### **4. Alert System**

- `POST /api/alerts/email` - Gửi email alert
- `POST /api/alerts/telegram` - Gửi Telegram alert
- `POST /api/alerts/test-email` - Test email connection
- `POST /api/alerts/test-telegram` - Test Telegram connection
- `GET /api/alerts/history` - Lấy alert history

#### **5. Reports**

- `GET /api/reports/overview` - Overview report

#### **6. Scheduled Tasks**

- Daily report at 9 AM (cron job)

### **Dependencies:**

```javascript
- express
- googleapis (Google Sheets & Drive)
- nodemailer (Email)
- axios (HTTP requests)
- node-cron (Scheduled tasks)
- dotenv (Environment variables)
```

### **Port**: 3001 (⚠️ Conflict với backend/server.js!)

### **Tóm Tắt Google Sheets Server:**

```
google-sheets-project/server.js
├── Authentication (hardcoded users)
├── Google Sheets API (read/write/append/create/info)
├── Google Drive API (upload/list/create/delete/share)
├── Alert System (Email + Telegram)
├── Reports
└── Scheduled Tasks (Daily reports)
```

---

## ⚠️ VẤN ĐỀ PHÁT HIỆN

### **1. Port Conflict**

- `backend/server.js` → Port **3001**
- `google-sheets-project/server.js` → Port **3001**
- **Xung đột!** Không thể chạy cả 2 cùng lúc

### **2. Automation Không Kết Nối Với Backend/Google Sheets Servers**

- Automation chỉ kết nối với backend port **5001** (không tồn tại!)
- Automation không kết nối với `backend/server.js` (port 3001)
- Automation không kết nối với `google-sheets-project/server.js` (port 3001)

### **3. Thiếu Integration**

- Automation và Backend không giao tiếp
- Automation và Google Sheets server không giao tiếp
- Các services chạy độc lập, không tích hợp

---

## 💡 ĐỀ XUẤT

### **1. Giải Quyết Port Conflict**

```javascript
// Option 1: Đổi port
backend/server.js → Port 3001
google-sheets-project/server.js → Port 3002

// Option 2: Merge 2 servers
// Tích hợp Google Sheets API vào backend/server.js
```

### **2. Tích Hợp Automation Với Backend**

```python
# automation/one_automation_once.py
# Đổi từ port 5001 → 3001
self.backend_url = "http://localhost:3001"
```

### **3. Tạo Service Registry**

```javascript
// services.json
{
  "backend": "http://localhost:3001",
  "google-sheets": "http://localhost:3002",
  "automation": "http://localhost:8000",
  "ai-service": "http://localhost:8000"
}
```

---

## 📋 TÓM TẮT

| Service | Port | Chức Năng | Kết Nối Với |
|---------|------|-----------|-------------|
| **automation** | 8000 | Automation Bridge | ❌ Backend (5001 - không tồn tại) |
| **backend/server.js** | 3001 | WebSocket + React | ❌ Không kết nối với automation |
| **google-sheets/server.js** | 3001 | Google Sheets API | ❌ Không kết nối với automation |
| **ai-service** | 8000 | AI Service | ❌ Không kết nối với automation |

**Kết luận**: Các services đang chạy **độc lập**, chưa tích hợp với nhau!
