# 📤 Google Apps Script - Upload Inventory Excel

Script để upload file Excel inventory lên Google Drive qua Google Apps Script.

---

## 🚀 Setup

### Bước 1: Tạo Google Apps Script

1. Truy cập: <https://script.google.com>
2. Tạo project mới
3. Copy code từ `upload-inventory-excel.gs` vào editor
4. Lưu project

### Bước 2: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Chọn type: **Web app**
3. Settings:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Copy **Web App URL**

### Bước 3: Sử dụng trong Python

```python
from upload_via_apps_script import upload_via_apps_script

result = upload_via_apps_script(
    file_path='downloads/Ton-Kho-Ban--2025-11-21.xlsx',
    apps_script_url='https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    folder_name='Inventory_20251121'
)
```

---

## 📝 Functions

### `uploadInventoryFile(fileName, fileData, folderName, folderId)`

Upload file Excel lên Google Drive.

**Parameters:**

- `fileName`: Tên file
- `fileData`: File data (Base64 string hoặc Blob)
- `folderName`: Tên folder (optional)
- `folderId`: ID folder (optional, ưu tiên hơn folderName)

**Returns:**

```json
{
  "success": true,
  "fileId": "1abc...",
  "fileName": "Ton-Kho-Ban--2025-11-21.xlsx",
  "fileUrl": "https://drive.google.com/...",
  "folderId": "1xyz...",
  "folderName": "Inventory_20251121"
}
```

### `doPost(e)`

Web App endpoint để nhận POST request từ automation service.

**Request:**

```json
{
  "fileName": "Ton-Kho-Ban--2025-11-21.xlsx",
  "fileData": "UEsDBBQAAAAIAA...",  // Base64
  "folderName": "Inventory_20251121",
  "folderId": "optional_folder_id"
}
```

### `createDateFolder(baseName)`

Tạo folder theo ngày.

**Parameters:**

- `baseName`: Tên base (mặc định: "Inventory")

**Returns:**

```json
{
  "success": true,
  "folderId": "1abc...",
  "folderName": "Inventory_20251121",
  "exists": false
}
```

---

## 🔧 Sử dụng trong Automation

### Option 1: Python Script

```bash
cd automation/one_automation_system
source venv/bin/activate
python upload_via_apps_script.py \
  downloads/Ton-Kho-Ban--2025-11-21.xlsx \
  https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Option 2: Tích hợp vào download_inventory_excel.py

Script đã được cập nhật để tự động thử upload trực tiếp trước, nếu thất bại mới dùng backend API.

---

## ✅ Ưu điểm

1. **Không cần backend**: Upload trực tiếp qua Google Apps Script
2. **Dễ deploy**: Chỉ cần deploy script lên Google Apps Script
3. **Tự động share**: Tự động share file với email đã cấu hình
4. **Tạo folder tự động**: Tự động tạo folder theo ngày

---

## ⚠️ Lưu ý

1. **Quota**: Google Apps Script có quota limit (100MB/day cho file upload)
2. **Timeout**: Request có thể timeout nếu file quá lớn (>10MB)
3. **Security**: Web App URL cần được bảo vệ nếu chứa dữ liệu nhạy cảm

---

**Version:** 1.0.0
**Last Updated:** 21/11/2024
