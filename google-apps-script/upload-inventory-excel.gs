/**
 * Google Apps Script để upload file Excel từ URL hoặc Base64 lên Google Drive
 *
 * Cách sử dụng:
 * 1. Deploy script này lên Google Apps Script
 * 2. Gọi function uploadInventoryFile() với file data
 * 3. Hoặc tạo Web App để nhận file từ automation service
 */

/**
 * Upload file Excel lên Google Drive
 *
 * @param {string} fileName - Tên file
 * @param {string} fileData - File data dạng Base64 hoặc Blob
 * @param {string} folderName - Tên folder (optional)
 * @param {string} folderId - ID folder (optional, ưu tiên hơn folderName)
 * @return {Object} Thông tin file đã upload
 */
function uploadInventoryFile(fileName, fileData, folderName, folderId) {
  try {
    // Tìm hoặc tạo folder
    let targetFolder;

    if (folderId) {
      try {
        targetFolder = DriveApp.getFolderById(folderId);
      } catch (e) {
        Logger.log('⚠️ Không tìm thấy folder với ID: ' + folderId);
        targetFolder = null;
      }
    }

    if (!targetFolder && folderName) {
      // Tìm folder theo tên
      const folders = DriveApp.getFoldersByName(folderName);
      if (folders.hasNext()) {
        targetFolder = folders.next();
        Logger.log('✅ Tìm thấy folder: ' + folderName);
      } else {
        // Tạo folder mới
        targetFolder = DriveApp.createFolder(folderName);
        Logger.log('✅ Đã tạo folder mới: ' + folderName);
      }
    }

    // Convert Base64 sang Blob nếu cần
    let blob;
    if (typeof fileData === 'string') {
      // Giả sử là Base64
      const bytes = Utilities.base64Decode(fileData);
      blob = Utilities.newBlob(
        bytes,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileName
      );
    } else {
      blob = fileData;
    }

    // Upload file
    let file;
    if (targetFolder) {
      file = targetFolder.createFile(blob);
    } else {
      file = DriveApp.createFile(blob);
    }

    Logger.log('✅ Đã upload file: ' + file.getName());
    Logger.log('📄 File ID: ' + file.getId());
    Logger.log('🔗 URL: ' + file.getUrl());

    // Share với email (optional)
    const shareEmails = ['Phuc.cao@mia.vn'];
    shareEmails.forEach(function (email) {
      try {
        file.addViewer(email);
        Logger.log('✅ Đã share với: ' + email);
      } catch (e) {
        Logger.log('⚠️ Không thể share với ' + email + ': ' + e);
      }
    });

    return {
      success: true,
      fileId: file.getId(),
      fileName: file.getName(),
      fileUrl: file.getUrl(),
      folderId: targetFolder ? targetFolder.getId() : null,
      folderName: targetFolder ? targetFolder.getName() : null,
    };
  } catch (error) {
    Logger.log('❌ Lỗi upload file: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
    };
  }
}

/**
 * Web App endpoint để nhận file từ automation service
 *
 * @param {Object} e - Event object từ POST request
 * @return {Object} Kết quả upload
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);

    const fileName =
      postData.fileName ||
      'inventory_' +
        Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          'yyyyMMdd_HHmmss'
        ) +
        '.xlsx';
    const fileData = postData.fileData; // Base64 string
    const folderName =
      postData.folderName ||
      'Inventory_' +
        Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          'yyyyMMdd'
        );
    const folderId = postData.folderId;

    const result = uploadInventoryFile(
      fileName,
      fileData,
      folderName,
      folderId
    );

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function
 */
function testUpload() {
  // Test với sample data
  const testData = 'UEsDBBQAAAAIAA=='; // Sample Base64 (empty Excel file)
  const result = uploadInventoryFile(
    'test_inventory.xlsx',
    testData,
    'Test_Inventory',
    null
  );

  Logger.log('Test result: ' + JSON.stringify(result));
}

/**
 * Tạo folder theo ngày
 *
 * @param {string} baseName - Tên base (mặc định: "Inventory")
 * @return {Object} Folder info
 */
function createDateFolder(baseName) {
  baseName = baseName || 'Inventory';
  const dateStr = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyyMMdd'
  );
  const folderName = baseName + '_' + dateStr;

  try {
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      const folder = folders.next();
      return {
        success: true,
        folderId: folder.getId(),
        folderName: folder.getName(),
        exists: true,
      };
    } else {
      const folder = DriveApp.createFolder(folderName);
      return {
        success: true,
        folderId: folder.getId(),
        folderName: folder.getName(),
        exists: false,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.toString(),
    };
  }
}
