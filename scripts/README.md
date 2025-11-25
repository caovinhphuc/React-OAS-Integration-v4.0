# 📜 Scripts Directory

Thư mục chứa các script hỗ trợ cho dự án React Google Integration.

## 📋 Danh sách Scripts

### 🏥 Health Check

**File:** `health-check.cjs`
**Mô tả:** Kiểm tra sức khỏe của ứng dụng và các services (Google APIs, Email, Telegram)
**Cách dùng:**

```bash
npm run health-check
# hoặc
node scripts/health-check.cjs
```

### 🧪 Test Google Connection

**File:** `testGoogleConnection.cjs`
**Mô tả:** Test kết nối Google Service Account và Google Sheets API
**Cách dùng:**

```bash
npm run test:google
# hoặc
node scripts/testGoogleConnection.cjs
```

### 📊 Test Google Sheets

**File:** `testGoogleSheets.js`
**Mô tả:** Test đầy đủ các chức năng Google Sheets (read, write, append)
**Cách dùng:**

```bash
npm run test:sheets
# hoặc
node scripts/testGoogleSheets.js
```

### 🔧 Setup Script

**File:** `setup.js`
**Mô tả:** Script tự động setup dự án (cài dependencies, tạo .env, test kết nối)
**Cách dùng:**

```bash
npm run setup
# hoặc
node scripts/setup.js
```

### 🚀 Deploy Script

**File:** `deploy.js`
**Mô tả:** Script tự động deploy lên các platform (Netlify, Vercel, AWS, GCP)
**Cách dùng:**

```bash
npm run deploy
# hoặc
node scripts/deploy.js
```

### ⚡ Build Optimize

**File:** `build-optimize.js`
**Mô tả:** Tối ưu hóa build production (minify, compress, security headers)
**Cách dùng:**

```bash
npm run build:optimize
# hoặc
node scripts/build-optimize.js
```

### 🔍 Check Environment

**File:** `check-env.sh`
**Mô tả:** Kiểm tra các biến môi trường cần thiết trước khi deploy
**Cách dùng:**

```bash
npm run check-env
# hoặc
bash scripts/check-env.sh
```

### 🔗 Setup GitHub

**File:** `setup-github.sh`
**Mô tả:** Script tự động setup GitHub repository và CI/CD
**Cách dùng:**

```bash
npm run setup-github
# hoặc
bash scripts/setup-github.sh
```

### 📝 Create Env from JSON

**File:** `create-env-from-json.js`
**Mô tả:** Tạo file .env từ Google Service Account JSON file
**Cách dùng:**

```bash
node scripts/create-env-from-json.js
```

## 🎯 Workflow Khuyến Nghị

### 1. Setup Lần Đầu

```bash
# Chạy setup script
npm run setup

# Test kết nối Google
npm run test:google

# Health check toàn bộ hệ thống
npm run health-check
```

### 2. Trước Khi Deploy

```bash
# Kiểm tra environment variables
npm run check-env

# Test tất cả services
npm run test:google
npm run health-check

# Build và optimize
npm run build:optimize
```

### 3. Deploy

```bash
# Deploy tự động
npm run deploy

# Hoặc setup GitHub và deploy thủ công
npm run setup-github
```

## 📝 Lưu Ý

- Tất cả scripts cần file `.env` được cấu hình đầy đủ
- Một số scripts yêu cầu quyền thực thi (chmod +x)
- Scripts sử dụng cả biến môi trường `REACT_APP_*` và không prefix
- Health check sẽ tạo file report JSON sau mỗi lần chạy

## 🔧 Troubleshooting

### Script không chạy được

```bash
# Cấp quyền thực thi
chmod +x scripts/*.sh
chmod +x scripts/*.cjs
```

### Lỗi environment variables

- Kiểm tra file `.env` có tồn tại không
- Đảm bảo các biến cần thiết đã được set
- Chạy `npm run check-env` để kiểm tra

### Lỗi Google APIs

- Kiểm tra Service Account credentials
- Đảm bảo Sheet/Drive đã được share với Service Account email
- Chạy `npm run test:google` để debug
