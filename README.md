# 🚀 React OAS Integration v3.0 - ONE Automation Platform

<div align="center">

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/caovinhphuc/-React-OAS-Integration-v3.0)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-yellow.svg)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal.svg)](https://fastapi.tiangolo.com/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

**🤖 AI-Powered Automation Platform với Tích Hợp Google Sheets**

[📖 Documentation](#-documentation) • [🚀 Quick Start](#-cài-đặt-và-khởi-chạy) • [🏗️ Architecture](#️-kiến-trúc-hệ-thống) • [📊 Features](#-tính-năng-chính)

</div>

---

## 📋 Tổng quan

**React OAS Integration v3.0** là một nền tảng tự động hóa hoàn chỉnh với AI-powered analytics, tích hợp với Google Sheets và hệ thống ONE Page. Hệ thống cung cấp:

- 🤖 **Automation System**: Thu thập dữ liệu tự động từ ONE Page
- 📊 **Google Sheets Integration**: Kho lưu trữ dữ liệu tập trung
- 🧠 **AI Service**: Phân tích thông minh và dự đoán
- 📈 **Analytics & Reports**: Thống kê và báo cáo tự động
- 💡 **Recommendations Engine**: Đề xuất giải pháp tối ưu

---

## 🏗️ Kiến trúc hệ thống

### 📊 Luồng dữ liệu hoàn chỉnh

```
┌─────────────────────────────────────────────────────────────────┐
│              ONE AUTOMATION PLATFORM v3.0                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │ 🤖 AUTOMATION│────▶│ 📊 GOOGLE    │────▶│ 🧠 AI SERVICE│   │
│  │   SYSTEM     │     │   SHEETS     │     │   (FastAPI)  │   │
│  │  (Python)    │     │  (Storage)   │     │   Port: 8000 │   │
│  └──────────────┘     └──────────────┘     └──────────────┘   │
│         │                    │                       │          │
│         │                    │                       ▼          │
│         │                    │              ┌──────────────┐   │
│         │                    │              │ 📈 ANALYTICS │   │
│         │                    │              │   Engine     │   │
│         │                    │              └──────────────┘   │
│         │                    │                       │          │
│         │                    │                       ▼          │
│         │                    │              ┌──────────────┐   │
│         │                    │              │ 💡 RECOMMEND │   │
│         │                    │              │   Engine     │   │
│         │                    │              └──────────────┘   │
│         │                    │                                 │
│         └────────────────────┼─────────────────────────────────┘
│                              │                                  │
│                    ┌─────────▼──────────┐                      │
│                    │  🎨 FRONTEND       │                      │
│                    │  React Dashboard   │                      │
│                    │  Port: 8080        │                      │
│                    └────────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 🔄 Chi tiết từng component

#### 🤖 **Automation System** (`automation/`)

- **Nhiệm vụ**: Thu thập dữ liệu tự động từ ONE Page
- **Công nghệ**: Python, Selenium, Pandas
- **Chức năng**: Login, Scrape, Process, Export to Sheets
- **Lịch trình**: Cron jobs (6:00 AM daily) hoặc manual trigger

#### 📊 **Google Sheets** (`shared-services/google-sheets/`)

- **Nhiệm vụ**: Kho lưu trữ dữ liệu tập trung
- **Cấu trúc**: Orders, Analytics, Config, Logs
- **API**: Google Sheets API v4

#### 🧠 **AI Service** (`ai-service/`)

- **Nhiệm vụ**: Phân tích thông minh, dự đoán, tối ưu hóa
- **Công nghệ**: FastAPI, scikit-learn, COBYQA
- **Endpoints**: `/ai/analyze`, `/ai/predictions`, `/ai/optimization`

#### 📈 **Analytics Module** (`analytics/`) ⚠️ **Đang phát triển**

- **Nhiệm vụ**: Thống kê, báo cáo, visualization
- **Chức năng**: Metrics calculation, Reports generation

#### 💡 **Recommendations Engine** ⚠️ **Đang phát triển**

- **Nhiệm vụ**: Đề xuất giải pháp từ phân tích AI
- **Chức năng**: Priority ranking, Impact analysis

#### 🎨 **Frontend** (`src/`)

- **Công nghệ**: React 18, Redux Toolkit, Recharts
- **Features**: Live Dashboard, AI Analytics, Google Sheets UI

#### 🔧 **Backend** (`backend/`)

- **Công nghệ**: Node.js, Express, Socket.IO
- **Features**: WebSocket real-time, API endpoints

---

## 🚀 Cài đặt và khởi chạy

### 📋 Yêu cầu hệ thống

| Component | Version | Ghi chú |
|-----------|---------|---------|
| **Node.js** | 18+ | Runtime cho Frontend & Backend |
| **Python** | 3.9+ | Runtime cho Automation & AI Service |
| **npm/yarn** | Latest | Package manager |
| **Git** | Latest | Version control |

### ⚡ Khởi chạy nhanh

```bash
# 1. Clone repository
git clone https://github.com/caovinhphuc/-React-OAS-Integration-v3.0.git
cd -React-OAS-Integration-v3.0

# 2. Khởi chạy tất cả services (Recommended)
./start_ai_platform.sh

# Hoặc khởi chạy từng service riêng lẻ:
```

### 🔧 Khởi chạy từng service

#### **1. Frontend (React)**

```bash
# Cài đặt dependencies
npm install

# Development mode
npm start
# → Mở http://localhost:8080

# Production build
npm run build
npx serve -s build -l 8080
```

#### **2. Backend (Node.js)**

```bash
cd backend
npm install
npm start
# → Chạy trên http://localhost:3001
```

#### **3. AI Service (FastAPI)**

```bash
cd ai-service

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # Trên Windows: venv\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt

# Khởi chạy service
uvicorn ai_service:app --host 0.0.0.0 --port 8000 --reload
# → Chạy trên http://localhost:8000

# Hoặc dùng script
./setup_venv.sh
```

#### **4. Automation System (Python)**

```bash
cd automation

# Kích hoạt virtual environment
source venv/bin/activate  # Hoặc: . venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy automation
python automation.py

# Hoặc chạy main API server
python main.py
# → Chạy trên http://localhost:8000 (nếu dùng FastAPI)
```

---

## 🌐 Truy cập ứng dụng

Sau khi khởi chạy thành công, truy cập các endpoints:

| Service | URL | Mô tả |
|---------|-----|-------|
| 🎨 **Frontend** | <http://localhost:8080> | Giao diện chính |
| 📊 **Dashboard** | <http://localhost:8080/dashboard> | Live Dashboard |
| 🧠 **AI Analytics** | <http://localhost:8080/ai-analytics> | AI Analytics |
| 📋 **Google Sheets** | <http://localhost:8080/google-sheets> | Google Sheets UI |
| 🔧 **Backend API** | <http://localhost:3001/health> | Health check |
| 🧠 **AI Service** | <http://localhost:8000/health> | AI Service health |
| 📚 **API Docs** | <http://localhost:8000/docs> | FastAPI Swagger UI |

---

## 📊 Tính năng chính

### ✅ Đã hoàn thành

| Feature | Status | Mô tả |
|---------|--------|-------|
| 🤖 **Automation System** | ✅ | Thu thập dữ liệu từ ONE Page tự động |
| 📊 **Google Sheets Integration** | ✅ | Tích hợp đầy đủ với Google Sheets API |
| 🧠 **AI Service** | ✅ | FastAPI service với ML capabilities |
| 🎨 **Frontend Dashboard** | ✅ | React dashboard với real-time updates |
| 🔧 **Backend API** | ✅ | Node.js server với WebSocket |
| 📈 **Live Dashboard** | ✅ | Real-time charts và metrics |

### ⚠️ Đang phát triển

| Feature | Status | Ưu tiên |
|---------|--------|---------|
| 📈 **Analytics Module** | 🚧 | **RẤT CAO** - Statistics & Reports engine |
| 💡 **Recommendations Engine** | 🚧 | **RẤT CAO** - Đề xuất giải pháp |
| 🔄 **Data Pipeline** | 🚧 | **CAO** - Kết nối Automation → Sheets → AI |
| ⏰ **Scheduler Service** | 🚧 | **CAO** - Cron jobs cho automation |
| 📝 **OnePage Service** | 🚧 | **CAO** - Service lấy dữ liệu nguồn |

---

## 🛠️ Công nghệ sử dụng

### Frontend Stack

```json
{
  "framework": "React 18.2.0",
  "routing": "React Router v6",
  "state": "Redux Toolkit",
  "charts": "Recharts 2.8.0",
  "realtime": "Socket.IO Client",
  "http": "Axios",
  "styling": "Styled Components"
}
```

### Backend Stack

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "realtime": "Socket.IO",
  "middleware": "CORS, Helmet, Morgan"
}
```

### AI/ML Stack

```json
{
  "language": "Python 3.9+",
  "framework": "FastAPI",
  "server": "Uvicorn",
  "ml": "scikit-learn, NumPy, Pandas",
  "optimization": "COBYQA"
}
```

### Automation Stack

```json
{
  "webdriver": "Selenium",
  "data": "Pandas",
  "sheets": "gspread",
  "scheduling": "schedule/cron"
}
```

---

## 📁 Cấu trúc thư mục

```
React-OAS-Integration-v3.0/
├── 📁 src/                          # Frontend React app
│   ├── components/                  # React components
│   │   ├── ai/                     # AI dashboard
│   │   ├── dashboard/              # Live dashboard
│   │   ├── google/                 # Google Sheets UI
│   │   └── common/                 # Shared components
│   ├── store/                      # Redux store
│   └── App.jsx                     # Main App
│
├── 📁 backend/                      # Node.js backend
│   ├── server.js                   # Express server
│   └── package.json
│
├── 📁 ai-service/                   # AI/ML FastAPI service
│   ├── ai_service.py               # Main FastAPI app
│   ├── optimization/               # COBYQA optimization
│   └── requirements.txt
│
├── 📁 automation/                   # 🤖 Automation System
│   ├── automation.py               # Main automation class
│   ├── main.py                     # FastAPI automation API
│   ├── services/                   # Automation services
│   │   ├── google_sheets_service.py
│   │   ├── email_service.py
│   │   └── data_processor.py
│   ├── scripts/                    # Automation scripts
│   ├── config/                     # Configuration files
│   └── requirements.txt
│
├── 📁 one_automation_system/        # One automation system
│   └── main.py                     # Alternative main API
│
├── 📁 shared-services/              # Shared services
│   └── google-sheets/              # Google Sheets integration
│
├── 📁 analytics/                    # 📈 Analytics Module (⚠️ Đang phát triển)
│   ├── statistics.py               # Statistics engine
│   ├── reports.py                  # Reports generator
│   └── recommendations.py          # Recommendations engine
│
├── 📁 docs/                         # Documentation
├── 📁 scripts/                      # Utility scripts
├── 📄 README.md                     # This file
├── 📄 ARCHITECTURE_GUIDE.md         # Kiến trúc chi tiết
├── 📄 ROADMAP_NEXT_STEPS.md         # Roadmap phát triển
└── 📄 package.json                  # Main package.json
```

---

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` trong thư mục gốc:

```env
# Backend Configuration
PORT=3001
NODE_ENV=development

# AI Service Configuration
AI_SERVICE_PORT=8000
AI_SERVICE_HOST=0.0.0.0

# Frontend Configuration
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:8000

# Google Sheets Configuration
GOOGLE_CREDENTIALS_PATH=config/service_account.json
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id

# Automation Configuration
ONE_USERNAME=your_username
ONE_PASSWORD=your_password
```

### Google Sheets Setup

Xem hướng dẫn chi tiết tại: [`GOOGLE_SHEETS_SETUP_GUIDE.md`](GOOGLE_SHEETS_SETUP_GUIDE.md)

**Tóm tắt:**

1. Tạo Google Cloud Project
2. Enable Google Sheets API & Google Drive API
3. Tạo Service Account
4. Download JSON credentials
5. Share Google Sheet với service account email

---

## 📝 API Documentation

### 🔧 Backend API (Port 3001)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/health` | Health check |
| `GET` | `/api/status` | Service status |
| `WebSocket` | `/` | Real-time data updates |

### 🧠 AI Service API (Port 8000)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Swagger UI documentation |
| `GET` | `/ai/predictions` | Get AI predictions |
| `GET` | `/ai/anomalies` | Detect anomalies |
| `POST` | `/ai/optimization/solve` | Solve optimization problem |
| `GET` | `/ai/optimization/status` | Check optimization engine |

### 🤖 Automation API (Port 8000)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Detailed health check |
| `POST` | `/api/automation/run` | Run automation task |
| `GET` | `/api/google-sheets/{id}` | Get Sheets data |
| `POST` | `/api/google-sheets/{id}` | Update Sheets data |
| `POST` | `/api/email/send` | Send email |

---

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Start production services
NODE_ENV=production ./start_ai_platform.sh
```

### Docker Deployment

```bash
# Build và run với Docker Compose
docker-compose -f docker-compose.production.yml up -d

# Hoặc build từng service
docker build -t react-oas-frontend .
docker build -t react-oas-backend ./backend
docker build -t react-oas-ai ./ai-service
```

### Vercel Deployment

```bash
# Frontend có thể deploy lên Vercel
vercel deploy
```

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>❌ Port already in use</b></summary>

```bash
# Kill processes trên các ports
lsof -ti:3001,8000,8080 | xargs kill -9

# Hoặc đổi ports trong .env
```

</details>

<details>
<summary><b>❌ Python dependencies not found</b></summary>

```bash
# Cài đặt Python dependencies
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Hoặc dùng script
./setup_venv.sh
```

</details>

<details>
<summary><b>❌ Node modules issues</b></summary>

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

</details>

<details>
<summary><b>❌ Google Sheets authentication failed</b></summary>

```bash
# Kiểm tra:
1. Service account JSON file có đúng path không
2. Google Sheet đã share với service account email chưa
3. Google Sheets API đã được enable chưa
```

</details>

### 📋 Logs

Kiểm tra logs trong thư mục `logs/`:

- `frontend.log` - Frontend server logs
- `backend.log` - Backend server logs
- `ai-service.log` - AI service logs
- `automation.log` - Automation system logs

---

## 📚 Documentation

| Document | Mô tả |
|----------|-------|
| [`ARCHITECTURE_GUIDE.md`](ARCHITECTURE_GUIDE.md) | 📖 Kiến trúc hệ thống chi tiết |
| [`ROADMAP_NEXT_STEPS.md`](ROADMAP_NEXT_STEPS.md) | 🗺️ Roadmap phát triển |
| [`GOOGLE_SHEETS_SETUP_GUIDE.md`](GOOGLE_SHEETS_SETUP_GUIDE.md) | 📊 Hướng dẫn setup Google Sheets |
| [`PHASE_1_DETAILED_GUIDE.md`](PHASE_1_DETAILED_GUIDE.md) | 📝 Chi tiết Phase 1 |
| [`STEP_BY_STEP_GUIDE.md`](STEP_BY_STEP_GUIDE.md) | 🔄 Hướng dẫn từng bước |

---

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. **Fork** repository
2. **Tạo feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Tạo Pull Request**

### Development Guidelines

- Follow code style và conventions
- Thêm tests cho features mới
- Update documentation khi cần
- Keep commits atomic và descriptive

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 📞 Support & Contact

- 📧 **Email**: <support@example.com>
- 💬 **GitHub Issues**: [Create an issue](https://github.com/caovinhphuc/-React-OAS-Integration-v3.0/issues)
- 📚 **Documentation**: Xem thư mục `docs/`
- 🐛 **Bug Reports**: Vui lòng tạo issue với label `bug`

---

## 🙏 Acknowledgments

- ⚛️ **React Team** - Amazing UI framework
- 🚀 **FastAPI Team** - High-performance web framework
- 🔌 **Socket.IO Team** - Real-time communication
- 📊 **Google Sheets API** - Powerful spreadsheet integration
- 🤖 **Selenium** - Web automation framework
- 📈 **Recharts** - Beautiful chart library
- 👥 **All Contributors** - Thanks for your contributions!

---

## 🎯 Project Status

| Component | Status | Version |
|-----------|--------|---------|
| Frontend | ✅ Stable | 3.0.0 |
| Backend | ✅ Stable | 3.0.0 |
| AI Service | ✅ Stable | 4.0.0 |
| Automation | ✅ Stable | 1.0.0 |
| Analytics | 🚧 In Development | - |
| Recommendations | 🚧 In Development | - |

---

<div align="center">

**Made with ❤️ by [caovinhphuc](https://github.com/caovinhphuc)**

⭐ **Star** this repo nếu bạn thấy hữu ích!

[⬆ Back to Top](#-react-oas-integration-v30---one-automation-platform)

</div>
