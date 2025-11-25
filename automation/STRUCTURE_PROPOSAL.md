# 📁 Đề Xuất Cấu Trúc Automation Mới

## 🔍 Vấn Đề Hiện Tại

1. **Trùng lặp**: Có cả `automation/` và `automation/automation_new/` với nhiều file giống nhau
2. **Không rõ ràng**: Không biết file nào đang được sử dụng
3. **Lộn xộn**: Nhiều file ở root level, khó tìm kiếm
4. **Thiếu tổ chức**: Không có phân loại rõ ràng giữa core, utils, tests

## ✨ Cấu Trúc Đề Xuất

```
automation/
├── README.md                    # Tài liệu chính
├── requirements.txt             # Dependencies
├── setup.sh                    # Setup script
│
├── core/                       # Core automation modules
│   ├── __init__.py
│   ├── automation.py           # Main automation class
│   ├── automation_enhanced.py  # Enhanced version
│   ├── session_manager.py     # Session management
│   └── base.py                # Base classes
│
├── services/                   # External services integration
│   ├── __init__.py
│   ├── google_sheets.py       # Google Sheets integration
│   ├── sla_monitor.py         # SLA monitoring
│   └── auth_service.py        # Authentication service
│
├── scripts/                    # Automation scripts
│   ├── __init__.py
│   ├── setup.py               # System setup
│   ├── initialization.py      # System initialization
│   ├── login.py               # Login handling
│   ├── login_manager.py       # Complete login manager
│   ├── enhanced_scraper.py    # Web scraping
│   ├── date_customizer.py     # Date handling
│   └── pagination_handler.py  # Pagination
│
├── runners/                    # Entry points / runners
│   ├── __init__.py
│   ├── main.py                # Main entry point
│   ├── run_automation.py      # Standard runner
│   ├── run_with_logging.py    # Runner with logging
│   └── run_by_date.py         # Date-based runner
│
├── utils/                      # Utility functions
│   ├── __init__.py
│   ├── logger.py              # Logging utilities
│   ├── config_loader.py       # Config loading
│   └── helpers.py             # Helper functions
│
├── tests/                      # Tests
│   ├── __init__.py
│   ├── test_automation.py
│   ├── test_webdriver.py
│   ├── test_google_sheets.py
│   └── test_auth.py
│
├── config/                     # Configuration files
│   ├── config.json
│   ├── sla_config.json
│   └── service_account.json
│
├── data/                       # Data files
│   ├── exports/               # Exported data
│   └── imports/               # Imported data
│
├── logs/                       # Log files
│   └── .gitkeep
│
└── docs/                       # Documentation
    ├── SETUP.md
    ├── GOOGLE_SHEETS.md
    └── API.md
```

## 🎯 Lợi Ích

### 1. **Rõ Ràng Hơn**

- Mỗi thư mục có mục đích cụ thể
- Dễ tìm file cần thiết
- Phân tách rõ ràng giữa core, services, scripts

### 2. **Dễ Bảo Trì**

- Code được tổ chức theo chức năng
- Dễ thêm tính năng mới
- Dễ refactor

### 3. **Chuyên Nghiệp**

- Tuân theo best practices
- Dễ on-board developer mới
- Dễ scale

### 4. **Tránh Trùng Lặp**

- Một file cho một chức năng
- Không có `automation_new/` nữa
- Code được tái sử dụng tốt hơn

## 📋 Migration Plan

### Bước 1: Tạo cấu trúc mới

```bash
mkdir -p core services scripts runners utils tests docs
```

### Bước 2: Di chuyển files

- `automation.py` → `core/automation.py`
- `automation_enhanced.py` → `core/automation_enhanced.py`
- `google_sheets_config.py` → `services/google_sheets.py`
- `sla_monitor.py` → `services/sla_monitor.py`
- `scripts/*` → `scripts/` (giữ nguyên)
- `one_automation.py` → `runners/main.py`

### Bước 3: Cập nhật imports

- Sửa tất cả imports trong các file
- Đảm bảo relative imports đúng

### Bước 4: Test

- Chạy tests để đảm bảo không có lỗi
- Kiểm tra các entry points

### Bước 5: Cleanup

- Xóa `automation_new/` (sau khi đã migrate)
- Xóa các file duplicate

## 🚀 Quick Start Sau Khi Refactor

```bash
# Setup
./setup.sh

# Run automation
python runners/main.py

# Run with logging
python runners/run_with_logging.py

# Run tests
python -m pytest tests/
```

## 💡 Lưu Ý

- Giữ backward compatibility nếu có thể
- Update documentation
- Thông báo team về thay đổi
- Tạo migration script nếu cần
