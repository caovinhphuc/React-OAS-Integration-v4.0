# Google Apps Script - Backup Scripts

Thư mục này chứa các Google Apps Script để backup dữ liệu tự động.

## 📁 Files

- **`backup-script.gs`** - Script chính để backup Google Sheets tự động

## 🚀 Cài Đặt

### 1. Tạo Google Apps Script Project

1. Mở Google Sheets cần backup
2. Vào **Extensions** > **Apps Script**
3. Xóa code mặc định và copy nội dung từ `backup-script.gs`
4. Lưu project với tên "MIA Backup Script"

### 2. Cấu Hình Email (Tùy chọn)

Để nhận thông báo khi backup thành công:

**Option 1: Dùng Script Properties**

```javascript
// Trong Script Editor, chạy lệnh này một lần:
PropertiesService.getScriptProperties().setProperty(
  'BACKUP_EMAIL_RECIPIENTS',
  'email1@mia.vn,email2@mia.vn'
);
```

**Option 2: Sửa trực tiếp trong code**
Sửa function `getBackupEmailRecipients()` trong `backup-script.gs`

### 3. Tạo Trigger Tự Động

**Cách 1: Dùng Function Setup**

```javascript
// Chạy function này một lần trong Script Editor:
setupWeeklyBackupTrigger();
```

**Cách 2: Tạo Trigger Thủ Công**

1. Trong Script Editor, click **Triggers** (⏰) ở sidebar trái
2. Click **+ Add Trigger**
3. Cấu hình:
   - **Function:** `weeklyBackup`
   - **Event source:** Time-driven
   - **Type:** Week timer
   - **Day:** Monday
   - **Time:** 9:00 AM - 10:00 AM
4. Click **Save**

## 📋 Functions

### `weeklyBackup()`

Backup sheet hiện tại. Tạo file mới với tên: `{SpreadsheetName}_Backup_{Timestamp}`

**Usage:**

```javascript
// Chạy từ Script Editor hoặc trigger
weeklyBackup();
```

### `backupAllSheets()`

Backup tất cả sheets trong spreadsheet hiện tại.

**Usage:**

```javascript
backupAllSheets();
```

### `backupSpecificSheet(sheetId, sheetName)`

Backup một sheet cụ thể theo ID.

**Parameters:**

- `sheetId` (string): ID của Google Spreadsheet
- `sheetName` (string): Tên sheet cần backup

**Usage:**

```javascript
backupSpecificSheet('1ABC123...', 'Sheet1');
```

### `setupWeeklyBackupTrigger()`

Tạo trigger tự động chạy backup hàng tuần (thứ 2, 9:00 AM).

**Usage:**

```javascript
// Chạy một lần để setup
setupWeeklyBackupTrigger();
```

### `cleanupOldBackups(daysOld)`

Xóa các file backup cũ hơn X ngày (mặc định 30 ngày).

**Parameters:**

- `daysOld` (number, optional): Số ngày. Mặc định: 30

**Usage:**

```javascript
// Xóa backup cũ hơn 30 ngày
cleanupOldBackups(30);

// Xóa backup cũ hơn 7 ngày
cleanupOldBackups(7);
```

### `testBackup()`

Test function để kiểm tra backup có hoạt động không.

**Usage:**

```javascript
testBackup();
```

## 🔧 Cấu Hình

### Email Recipients

Sửa trong function `getBackupEmailRecipients()`:

```javascript
function getBackupEmailRecipients() {
  return [
    'admin@mia.vn',
    'manager@mia.vn',
    // Thêm email khác
  ];
}
```

Hoặc dùng Script Properties:

```javascript
PropertiesService.getScriptProperties().setProperty(
  'BACKUP_EMAIL_RECIPIENTS',
  'email1@mia.vn,email2@mia.vn'
);
```

### Thay Đổi Lịch Backup

Sửa trong function `setupWeeklyBackupTrigger()`:

```javascript
// Backup hàng ngày lúc 8:00 AM
ScriptApp.newTrigger('weeklyBackup')
  .timeBased()
  .everyDays(1)
  .atHour(8)
  .create();

// Backup hàng tháng (ngày 1, 9:00 AM)
ScriptApp.newTrigger('weeklyBackup')
  .timeBased()
  .onMonthDay(1)
  .atHour(9)
  .create();
```

## 📊 Monitoring

### Xem Logs

1. Mở Script Editor
2. Click **Executions** để xem lịch sử chạy
3. Click vào execution để xem logs

### Kiểm Tra Backup

1. Mở Google Drive
2. Tìm files có tên pattern: `*_Backup_*` hoặc `*_FullBackup_*`
3. Files được tạo tự động với timestamp

## 🛠️ Troubleshooting

### Backup không chạy

1. **Kiểm tra trigger:**
   - Vào **Triggers** trong Script Editor
   - Đảm bảo trigger đang **Enabled**

2. **Kiểm tra permissions:**
   - Chạy `testBackup()` thủ công
   - Nếu có lỗi permission, click **Review Permissions**

3. **Kiểm tra logs:**
   - Vào **Executions** để xem error messages

### Email không gửi được

1. **Kiểm tra email recipients:**
   - Đảm bảo function `getBackupEmailRecipients()` trả về đúng email

2. **Kiểm tra quota:**
   - Google Apps Script có giới hạn 100 emails/ngày
   - Nếu vượt quota, sẽ không gửi được

### File backup không tạo

1. **Kiểm tra Drive permissions:**
   - Script cần quyền tạo files trong Drive

2. **Kiểm tra quota:**
   - Google Drive có giới hạn storage
   - Nếu đầy, không thể tạo file mới

## 📝 Notes

- Backup files được tạo trong Google Drive của account chạy script
- Files có format: `{OriginalName}_Backup_{YYYYMMDD_HHMMSS}`
- Script tự động copy format (màu sắc, font, etc.) nếu có thể
- Email notification chỉ gửi nếu cấu hình email recipients

## 🔗 Links

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [SpreadsheetApp API](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
- [DriveApp API](https://developers.google.com/apps-script/reference/drive/drive-app)

---

**Version:** 1.0.0
**Last Updated:** 21/11/2024
**Author:** MIA.vn
