# 🧪 Test Scripts Guide - React OAS Integration v4.0

## 📋 Tổng quan

Hướng dẫn sử dụng các test scripts trong dự án để kiểm tra các chức năng và tích hợp của hệ thống.

## 🎯 Quick Start

```bash
# Chạy tất cả tests
npm run test:complete

# Hoặc chạy từng loại test
npm run test:api
npm run test:automation
npm run test:google-sheets
```

## 📦 Test Scripts

### 1. Test All (`test-all.js`)

**Mô tả:** Chạy tất cả các test suites trong dự án một cách tự động.

**Cách dùng:**

```bash
npm run test:complete
# hoặc
node scripts/test-all.js
```

**Tính năng:**

- ✅ Chạy tuần tự tất cả test suites
- ✅ Tạo báo cáo chi tiết (JSON format)
- ✅ Hiển thị summary với thời gian thực thi
- ✅ Bỏ qua các test không tìm thấy file

**Output:**

- Console: Real-time test results
- File: `test-report-[timestamp].json`

---

### 2. Test API Endpoints (`test-api-endpoints.js`)

**Mô tả:** Test tất cả các API endpoints của Backend và AI Service.

**Cách dùng:**

```bash
npm run test:api
# hoặc
node scripts/test-api-endpoints.js
```

**Test các endpoints:**

- Backend API:
  - `/health` - Health check
  - `/api/status` - API status
  - `/api/orders` - Get orders
  - `/api/analytics` - Get analytics
  - `/api/statistics` - Get statistics

- AI Service:
  - `/health` - Health check
  - `/` - Service info
  - `/api/predictions` - AI predictions
  - `/api/analytics` - AI analytics

**Environment Variables:**

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:3001`)
- `REACT_APP_AI_SERVICE_URL` - AI Service URL (default: `http://localhost:8000`)

---

### 3. Test Automation System (`test-automation-system.js`)

**Mô tả:** Test các chức năng của Automation System (Python FastAPI).

**Cách dùng:**

```bash
npm run test:automation
# hoặc
node scripts/test-automation-system.js
```

**Test các phần:**

- ✅ Python environment check
- ✅ Automation files check (`main.py`, `automation_bridge.py`)
- ✅ Automation API endpoints

**Environment Variables:**

- `REACT_APP_AUTOMATION_API_URL` - Automation API URL (default: `http://localhost:8001`)
- `PYTHON_CMD` - Python command (default: `python3`)

---

### 4. Test Google Sheets (`testGoogleSheets.js`)

**Mô tả:** Test đầy đủ các chức năng Google Sheets (read, write, append).

**Cách dùng:**

```bash
npm run test:google-sheets
# hoặc
node scripts/testGoogleSheets.js
```

**Test các chức năng:**

- ✅ Google Service Account connection
- ✅ Read data from sheets
- ✅ Write data to sheets
- ✅ Append data to sheets
- ✅ Update existing data

**Environment Variables:**

- `REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID` - Spreadsheet ID
- `REACT_APP_GOOGLE_PRIVATE_KEY` - Service Account private key
- `REACT_APP_GOOGLE_CLIENT_EMAIL` - Service Account email

---

### 5. Test Google Connection (`testGoogleConnection.cjs`)

**Mô tả:** Test kết nối Google Service Account và Google Sheets API.

**Cách dùng:**

```bash
node scripts/testGoogleConnection.cjs
```

---

### 6. Test Frontend API Connection (`test_frontend_api_connection.js`)

**Mô tả:** Test kết nối giữa React frontend và Backend API.

**Cách dùng:**

```bash
node scripts/test_frontend_api_connection.js
```

---

### 7. Test Email Service (`testEmailService.js`)

**Mô tả:** Test chức năng gửi email qua Email Service.

**Cách dùng:**

```bash
node scripts/testEmailService.js
```

---

### 8. Test Telegram Connection (`testTelegramConnection.js`)

**Mô tả:** Test kết nối và gửi message qua Telegram bot.

**Cách dùng:**

```bash
node scripts/testTelegramConnection.js
```

---

### 9. Health Check (`health-check.cjs`)

**Mô tả:** Kiểm tra sức khỏe của ứng dụng và các services (Google APIs, Email, Telegram).

**Cách dùng:**

```bash
node scripts/health-check.cjs
```

**Tạo report:** `health-report-[timestamp].json`

---

## 🔧 Root Test Files

Các test files ở root directory (có thể chạy trực tiếp):

### 1. Complete System Test (`complete_system_test.js`)

```bash
node complete_system_test.js
```

### 2. End-to-End Test (`end_to_end_test.js`)

```bash
node end_to_end_test.js
```

### 3. Integration Test (`integration_test.js`)

```bash
node integration_test.js
```

### 4. Frontend Connection Test (`frontend_connection_test.js`)

```bash
node frontend_connection_test.js
```

---

## 📊 Test Workflow

### 1. Quick Test (Fast)

```bash
# Chỉ test API endpoints
npm run test:api
```

### 2. Full Test (Comprehensive)

```bash
# Chạy tất cả tests
npm run test:complete
```

### 3. Specific Service Test

```bash
# Test Automation
npm run test:automation

# Test Google Sheets
npm run test:google-sheets

# Test WebSocket
npm run test:websocket
```

---

## ⚙️ Configuration

### Environment Variables

Đảm bảo file `.env` có các biến sau:

```bash
# Backend & Services
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:8000
REACT_APP_AUTOMATION_API_URL=http://localhost:8001

# Google Services
REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
REACT_APP_GOOGLE_PRIVATE_KEY=your_private_key
REACT_APP_GOOGLE_CLIENT_EMAIL=your_service_account_email

# Email & Telegram (nếu cần)
REACT_APP_EMAIL_HOST=smtp.gmail.com
REACT_APP_EMAIL_PORT=587
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
```

---

## 📝 Notes

- Tất cả test scripts yêu cầu file `.env` được cấu hình đầy đủ
- Một số test scripts yêu cầu services đang chạy (backend, AI service)
- Test scripts tự động tạo reports trong JSON format
- Sử dụng `--legacy-peer-deps` khi cài dependencies nếu gặp conflict

---

## 🐛 Troubleshooting

### Test không chạy được

```bash
# Cấp quyền thực thi
chmod +x scripts/test-*.js
chmod +x scripts/test*.js

# Kiểm tra Node.js version
node --version  # Cần >= 16.0.0
```

### Lỗi connection timeout

- Kiểm tra services đang chạy:

  ```bash
  # Backend
  curl http://localhost:3001/health

  # AI Service
  curl http://localhost:8000/health
  ```

### Lỗi environment variables

```bash
# Kiểm tra .env file
cat .env

# Test một biến
echo $REACT_APP_API_URL
```

---

## 🎯 Best Practices

1. **Chạy tests trước khi deploy:**

   ```bash
   npm run test:complete
   ```

2. **Test từng service riêng:**

   ```bash
   npm run test:api
   npm run test:automation
   ```

3. **Xem reports chi tiết:**

   ```bash
   cat test-report-*.json | jq
   ```

4. **Tích hợp vào CI/CD:**
   - Thêm `npm run test:complete` vào CI pipeline
   - Check exit code để fail build nếu tests fail

---

**📚 Xem thêm:**

- [Scripts README](scripts/README.md)
- [Main README](README.md)
- [Architecture Guide](ARCHITECTURE_GUIDE.md)
