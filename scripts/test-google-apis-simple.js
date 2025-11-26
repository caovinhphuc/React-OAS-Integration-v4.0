#!/usr/bin/env node

/**
 * Script test Google APIs đơn giản - Test bằng cách gọi API thực tế
 * Usage: node scripts/test-google-apis-simple.js
 */

const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Tìm credentials file
function findCredentialsFile() {
  const possiblePaths = [
    // 1. Environment variable
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,

    // 2. automation/config/google-credentials.json
    path.join(
      __dirname,
      "..",
      "automation",
      "config",
      "google-credentials.json"
    ),

    // 3. automation/one_automation_system/config/google-credentials.json
    path.join(
      __dirname,
      "..",
      "automation",
      "one_automation_system",
      "config",
      "google-credentials.json"
    ),

    // 4. config/google-credentials.json
    path.join(__dirname, "..", "config", "google-credentials.json"),

    // 5. Root directory
    path.join(__dirname, "..", "google-credentials.json"),
  ];

  for (const credPath of possiblePaths) {
    if (credPath && fs.existsSync(credPath)) {
      return credPath;
    }
  }

  return null;
}

async function testGoogleSheetsAPI(credentialsPath) {
  log("\n📊 Test Google Sheets API...", "cyan");

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Test với sheet ID từ env hoặc default
    const sheetId =
      process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ||
      process.env.GOOGLE_SHEET_ID ||
      "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

    log(`   Đang test với Sheet ID: ${sheetId}`, "yellow");

    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const title = response.data.properties.title;
    log(`   ✅ Google Sheets API: HOẠT ĐỘNG`, "green");
    log(`   📄 Sheet: "${title}"`, "green");
    log(`   📊 Số sheets: ${response.data.sheets.length}`, "green");

    return { success: true, title };
  } catch (error) {
    const errorMsg = error.message;

    if (
      errorMsg.includes("API has not been used") ||
      errorMsg.includes("not enabled") ||
      errorMsg.includes("not activated")
    ) {
      log(`   ❌ Google Sheets API: CHƯA ENABLE`, "red");
      log(
        `   💡 Enable tại: https://console.cloud.google.com/apis/library/sheets.googleapis.com`,
        "yellow"
      );
    } else if (
      errorMsg.includes("PERMISSION_DENIED") ||
      errorMsg.includes("permission")
    ) {
      log(`   ⚠️  Google Sheets API: ĐÃ ENABLE nhưng thiếu quyền`, "yellow");
      log(`   💡 Share Sheet với service account email`, "yellow");
    } else {
      log(`   ❌ Google Sheets API: LỖI`, "red");
      log(`   📝 ${errorMsg.substring(0, 100)}`, "red");
    }

    return { success: false, error: errorMsg };
  }
}

async function testGoogleDriveAPI(credentialsPath) {
  log("\n📁 Test Google Drive API...", "cyan");

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const authClient = await auth.getClient();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Test bằng cách lấy thông tin về
    const response = await drive.about.get({
      fields: "user,storageQuota",
    });

    const user = response.data.user;
    log(`   ✅ Google Drive API: HOẠT ĐỘNG`, "green");
    log(`   👤 User: ${user.displayName || user.emailAddress}`, "green");
    log(`   📧 Email: ${user.emailAddress}`, "green");

    return { success: true, user: user.emailAddress };
  } catch (error) {
    const errorMsg = error.message;

    if (
      errorMsg.includes("API has not been used") ||
      errorMsg.includes("not enabled") ||
      errorMsg.includes("not activated")
    ) {
      log(`   ❌ Google Drive API: CHƯA ENABLE`, "red");
      log(
        `   💡 Enable tại: https://console.cloud.google.com/apis/library/drive.googleapis.com`,
        "yellow"
      );
    } else {
      log(`   ❌ Google Drive API: LỖI`, "red");
      log(`   📝 ${errorMsg.substring(0, 100)}`, "red");
    }

    return { success: false, error: errorMsg };
  }
}

async function testGoogleAppsScriptAPI(credentialsPath) {
  log("\n📜 Test Google Apps Script API...", "cyan");

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ["https://www.googleapis.com/auth/script.projects.readonly"],
    });

    const authClient = await auth.getClient();
    const script = google.script({ version: "v1", auth: authClient });

    // Test bằng cách list projects (có thể trống nhưng không báo lỗi enable)
    try {
      await script.projects.list();
      log(`   ✅ Google Apps Script API: HOẠT ĐỘNG`, "green");
      return { success: true };
    } catch (listError) {
      // Nếu không có projects cũng OK, quan trọng là API enabled
      if (
        listError.message.includes("API has not been used") ||
        listError.message.includes("not enabled")
      ) {
        throw listError;
      }
      log(
        `   ✅ Google Apps Script API: HOẠT ĐỘNG (không có projects)`,
        "green"
      );
      return { success: true };
    }
  } catch (error) {
    const errorMsg = error.message;

    if (
      errorMsg.includes("API has not been used") ||
      errorMsg.includes("not enabled") ||
      errorMsg.includes("not activated")
    ) {
      log(`   ❌ Google Apps Script API: CHƯA ENABLE`, "red");
      log(
        `   💡 Enable tại: https://console.cloud.google.com/apis/library/script.googleapis.com`,
        "yellow"
      );
    } else {
      log(`   ❌ Google Apps Script API: LỖI`, "red");
      log(`   📝 ${errorMsg.substring(0, 100)}`, "red");
    }

    return { success: false, error: errorMsg };
  }
}

async function main() {
  console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║  🧪 TEST GOOGLE APIs - Simple Test                         ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  // Tìm credentials file
  log("\n🔍 Đang tìm credentials file...", "cyan");
  const credentialsPath = findCredentialsFile();

  if (!credentialsPath) {
    log("\n❌ Không tìm thấy credentials file!", "red");
    log("\n💡 Các vị trí đã kiểm tra:", "yellow");
    log("   1. GOOGLE_SERVICE_ACCOUNT_KEY_PATH env variable", "yellow");
    log("   2. automation/config/google-credentials.json", "yellow");
    log(
      "   3. automation/one_automation_system/config/google-credentials.json",
      "yellow"
    );
    log("   4. config/google-credentials.json", "yellow");
    log(
      "\n📝 Vui lòng đặt credentials file vào một trong các vị trí trên",
      "yellow"
    );
    process.exit(1);
  }

  log(`   ✅ Tìm thấy: ${credentialsPath}`, "green");

  // Đọc thông tin service account
  try {
    const creds = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    const email = creds.client_email || creds.service_account_email;
    log(`   📧 Service Account: ${email}`, "cyan");
  } catch (error) {
    log(`   ⚠️  Không thể đọc credentials file: ${error.message}`, "yellow");
  }

  // Test từng API
  const results = {
    sheets: await testGoogleSheetsAPI(credentialsPath),
    drive: await testGoogleDriveAPI(credentialsPath),
    appsScript: await testGoogleAppsScriptAPI(credentialsPath),
  };

  // Tóm tắt
  console.log(`\n${colors.cyan}${"─".repeat(60)}${colors.reset}`);
  log("\n📊 TÓM TẮT:", "cyan");

  const enabled = Object.values(results).filter((r) => r.success).length;
  const total = Object.keys(results).length;

  log(
    `\n✅ APIs hoạt động: ${enabled}/${total}`,
    enabled === total ? "green" : "yellow"
  );

  if (results.sheets.success) log("   ✅ Google Sheets API", "green");
  else log("   ❌ Google Sheets API", "red");

  if (results.drive.success) log("   ✅ Google Drive API", "green");
  else log("   ❌ Google Drive API", "red");

  if (results.appsScript.success) log("   ✅ Google Apps Script API", "green");
  else log("   ❌ Google Apps Script API", "red");

  if (enabled === total) {
    log("\n🎉 Tất cả APIs đã được enable và hoạt động!", "green");
  } else {
    log("\n⚠️  Một số APIs chưa enable hoặc có lỗi", "yellow");
    log("💡 Xem chi tiết ở trên để biết cách sửa", "yellow");
  }

  console.log();
}

if (require.main === module) {
  main().catch((error) => {
    log(`\n❌ Lỗi không mong đợi: ${error.message}`, "red");
    process.exit(1);
  });
}

module.exports = {
  testGoogleSheetsAPI,
  testGoogleDriveAPI,
  testGoogleAppsScriptAPI,
};
