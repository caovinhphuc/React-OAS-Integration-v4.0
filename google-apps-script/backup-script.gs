/**
 * Google Apps Script - Backup Script
 * Tự động backup dữ liệu Google Sheets hàng tuần
 *
 * Setup:
 * 1. Tạo trigger hàng tuần: Triggers > Add Trigger > weeklyBackup > Time-driven > Week timer > Every Monday
 * 2. Hoặc chạy thủ công từ Script Editor
 *
 * @author MIA.vn
 * @version 1.0.0
 */

/**
 * Hàm chính: Tạo backup dữ liệu hàng tuần
 */
function weeklyBackup() {
  try {
    // Lấy sheet hiện tại
    const sheet = SpreadsheetApp.getActiveSheet();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Lấy tất cả dữ liệu
    const data = sheet.getDataRange().getValues();
    const sheetName = sheet.getName();
    const spreadsheetName = spreadsheet.getName();

    // Tạo tên file backup với timestamp
    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    const backupName = `${spreadsheetName}_Backup_${timestamp}`;

    // Tạo spreadsheet mới cho backup
    const backupSpreadsheet = SpreadsheetApp.create(backupName);
    const backupSheet = backupSpreadsheet.getActiveSheet();

    // Copy dữ liệu
    if (data.length > 0 && data[0].length > 0) {
      backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);

      // Copy format nếu có
      try {
        const sourceRange = sheet.getDataRange();
        const backupRange = backupSheet.getRange(
          1,
          1,
          data.length,
          data[0].length
        );
        sourceRange.copyFormatToRange(
          backupSheet,
          1,
          data[0].length,
          1,
          data.length
        );
      } catch (e) {
        console.log('Warning: Could not copy format: ' + e.message);
      }
    }

    // Lấy URL của file backup
    const backupUrl = backupSpreadsheet.getUrl();
    const backupId = backupSpreadsheet.getId();

    // Log kết quả
    const logMessage =
      `✅ Backup created successfully!\n` +
      `📁 File: ${backupName}\n` +
      `🔗 URL: ${backupUrl}\n` +
      `📊 Rows: ${data.length}\n` +
      `📅 Date: ${new Date().toLocaleString('vi-VN')}`;

    console.log(logMessage);

    // Gửi email thông báo (tùy chọn)
    try {
      const emailRecipients = getBackupEmailRecipients();
      if (emailRecipients && emailRecipients.length > 0) {
        MailApp.sendEmail({
          to: emailRecipients.join(','),
          subject: `✅ Backup thành công - ${backupName}`,
          body: logMessage + `\n\n🔗 Link: ${backupUrl}`,
          htmlBody:
            logMessage.replace(/\n/g, '<br>') +
            `<br><br><a href="${backupUrl}">Mở file backup</a>`,
        });
        console.log('📧 Email notification sent');
      }
    } catch (e) {
      console.log('Warning: Could not send email: ' + e.message);
    }

    return {
      success: true,
      backupName: backupName,
      backupUrl: backupUrl,
      backupId: backupId,
      rows: data.length,
      timestamp: timestamp,
    };
  } catch (error) {
    const errorMessage = `❌ Backup failed: ${error.message}`;
    console.error(errorMessage);

    // Gửi email báo lỗi
    try {
      const emailRecipients = getBackupEmailRecipients();
      if (emailRecipients && emailRecipients.length > 0) {
        MailApp.sendEmail({
          to: emailRecipients.join(','),
          subject: `❌ Backup thất bại - ${SpreadsheetApp.getActiveSpreadsheet().getName()}`,
          body:
            errorMessage +
            `\n\nError: ${error.toString()}\nStack: ${error.stack}`,
        });
      }
    } catch (e) {
      console.error('Could not send error email: ' + e.message);
    }

    throw error;
  }
}

/**
 * Backup tất cả sheets trong spreadsheet
 */
function backupAllSheets() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const allSheets = spreadsheet.getSheets();
    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    const backupName = `${spreadsheet.getName()}_FullBackup_${timestamp}`;

    // Tạo spreadsheet mới
    const backupSpreadsheet = SpreadsheetApp.create(backupName);

    // Backup từng sheet
    allSheets.forEach((sheet, index) => {
      const sheetName = sheet.getName();
      const data = sheet.getDataRange().getValues();

      // Tạo sheet mới trong backup
      let backupSheet;
      if (index === 0) {
        backupSheet = backupSpreadsheet.getActiveSheet();
        backupSheet.setName(sheetName);
      } else {
        backupSheet = backupSpreadsheet.insertSheet(sheetName);
      }

      // Copy dữ liệu
      if (data.length > 0 && data[0].length > 0) {
        backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
      }

      console.log(`✅ Backed up sheet: ${sheetName} (${data.length} rows)`);
    });

    const backupUrl = backupSpreadsheet.getUrl();
    console.log(`✅ Full backup created: ${backupName}`);
    console.log(`🔗 URL: ${backupUrl}`);

    return {
      success: true,
      backupName: backupName,
      backupUrl: backupUrl,
      sheetsCount: allSheets.length,
    };
  } catch (error) {
    console.error(`❌ Full backup failed: ${error.message}`);
    throw error;
  }
}

/**
 * Backup sheet cụ thể theo ID
 */
function backupSpecificSheet(sheetId, sheetName) {
  try {
    const sourceSpreadsheet = SpreadsheetApp.openById(sheetId);
    const sourceSheet = sourceSpreadsheet.getSheetByName(sheetName);

    if (!sourceSheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const data = sourceSheet.getDataRange().getValues();
    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    const backupName = `${sourceSpreadsheet.getName()}_${sheetName}_Backup_${timestamp}`;

    const backupSpreadsheet = SpreadsheetApp.create(backupName);
    const backupSheet = backupSpreadsheet.getActiveSheet();

    if (data.length > 0 && data[0].length > 0) {
      backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    }

    const backupUrl = backupSpreadsheet.getUrl();
    console.log(`✅ Sheet backup created: ${backupName}`);

    return {
      success: true,
      backupName: backupName,
      backupUrl: backupUrl,
      rows: data.length,
    };
  } catch (error) {
    console.error(`❌ Sheet backup failed: ${error.message}`);
    throw error;
  }
}

/**
 * Lấy danh sách email nhận thông báo backup
 * Có thể cấu hình trong Properties hoặc hardcode
 */
function getBackupEmailRecipients() {
  try {
    // Option 1: Lấy từ Properties
    const properties = PropertiesService.getScriptProperties();
    const emails = properties.getProperty('BACKUP_EMAIL_RECIPIENTS');

    if (emails) {
      return emails
        .split(',')
        .map(email => email.trim())
        .filter(email => email);
    }

    // Option 2: Hardcode (thay đổi theo nhu cầu)
    return [
      'admin@mia.vn',
      // Thêm email khác nếu cần
    ];
  } catch (error) {
    console.log('Warning: Could not get email recipients: ' + error.message);
    return [];
  }
}

/**
 * Setup trigger hàng tuần (chạy một lần để tạo trigger)
 */
function setupWeeklyBackupTrigger() {
  try {
    // Xóa trigger cũ nếu có
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'weeklyBackup') {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // Tạo trigger mới: Chạy mỗi thứ 2 lúc 9:00 AM
    ScriptApp.newTrigger('weeklyBackup')
      .timeBased()
      .everyWeeks(1)
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(9)
      .create();

    console.log('✅ Weekly backup trigger created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create trigger: ' + error.message);
    throw error;
  }
}

/**
 * Xóa tất cả backup cũ hơn X ngày
 */
function cleanupOldBackups(daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Lấy tất cả files trong Drive
    const files = DriveApp.getFiles();
    let deletedCount = 0;

    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName();

      // Kiểm tra nếu là file backup (có pattern _Backup_)
      if (fileName.includes('_Backup_') || fileName.includes('_FullBackup_')) {
        const fileDate = file.getLastModified();

        if (fileDate < cutoffDate) {
          try {
            file.setTrashed(true);
            deletedCount++;
            console.log(`🗑️ Deleted old backup: ${fileName}`);
          } catch (e) {
            console.log(`⚠️ Could not delete: ${fileName} - ${e.message}`);
          }
        }
      }
    }

    console.log(`✅ Cleanup completed. Deleted ${deletedCount} old backups.`);
    return deletedCount;
  } catch (error) {
    console.error(`❌ Cleanup failed: ${error.message}`);
    throw error;
  }
}

/**
 * Test function - chạy thử backup
 */
function testBackup() {
  console.log('🧪 Testing backup function...');
  const result = weeklyBackup();
  console.log('✅ Test completed:', result);
  return result;
}
