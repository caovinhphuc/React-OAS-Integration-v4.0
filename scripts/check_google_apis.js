#!/usr/bin/env node
/**
 * Script kiểm tra các Google API đang được sử dụng và xác định API nào còn thiếu
 * Usage: node scripts/check_google_apis.js
 */

const fs = require("fs");
const path = require("path");
const { GoogleAuth } = require("google-auth-library");

// ANSI colors cho terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

// Danh sách các Google API có thể được sử dụng trong project
const GOOGLE_APIS = {
  // APIs đang được sử dụng
  "sheets.googleapis.com": {
    name: "Google Sheets API",
    scope: "https://www.googleapis.com/auth/spreadsheets",
    required: true,
    usedIn: ["Frontend", "Backend", "Automation"],
  },
  "drive.googleapis.com": {
    name: "Google Drive API",
    scope: "https://www.googleapis.com/auth/drive",
    required: true,
    usedIn: ["Frontend", "Backend", "Automation"],
  },
  "script.googleapis.com": {
    name: "Google Apps Script API",
    scope: "https://www.googleapis.com/auth/script",
    required: true,
    usedIn: ["Automation"],
  },
  // APIs có thể được sử dụng nhưng chưa chắc chắn
  "maps.googleapis.com": {
    name: "Google Maps API",
    scope: "https://www.googleapis.com/auth/maps-platform",
    required: false,
    usedIn: ["Frontend (env.example only)"],
    note: "Chỉ có trong env.example, chưa thấy code sử dụng",
  },
  // APIs cho Shared Drive (nếu cần)
  "driveactivity.googleapis.com": {
    name: "Drive Activity API",
    scope: "https://www.googleapis.com/auth/drive.activity.readonly",
    required: false,
    usedIn: ["Automation (create_shared_drive.py)"],
    note: "Cần cho Shared Drive operations",
  },
};

// Scopes đang được yêu cầu trong code
const REQUIRED_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
];

/**
 * Đọc environment variables
 */
function getEnvVars() {
  const envPath = path.join(__dirname, "..", ".env");
  const envLocalPath = path.join(__dirname, "..", ".env.local");

  const envVars = {};

  // Đọc .env.local trước (ưu tiên)
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, "utf8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        envVars[match[1].trim()] = match[2].trim();
      }
    });
  }

  // Đọc .env
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && !envVars[match[1].trim()]) {
        envVars[match[1].trim()] = match[2].trim();
      }
    });
  }

  // Lấy từ process.env
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("GOOGLE_") || key.startsWith("REACT_APP_GOOGLE_")) {
      if (!envVars[key]) {
        envVars[key] = process.env[key];
      }
    }
  });

  return envVars;
}

/**
 * Kiểm tra xem API có được enable không bằng cách test authentication
 */
async function checkAPIEnabled(apiName, scope) {
  try {
    const envVars = getEnvVars();

    // Kiểm tra có credentials không
    if (
      !envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      !envVars.REACT_APP_GOOGLE_CLIENT_EMAIL &&
      !envVars.GOOGLE_PRIVATE_KEY &&
      !envVars.REACT_APP_GOOGLE_PRIVATE_KEY
    ) {
      return {
        enabled: null,
        error: "Không tìm thấy Google credentials trong environment variables",
      };
    }

    // Tạo credentials object
    const credentials = {
      type: "service_account",
      project_id:
        envVars.GOOGLE_PROJECT_ID ||
        envVars.REACT_APP_GOOGLE_PROJECT_ID ||
        "mia-logistics-469406",
      private_key_id:
        envVars.GOOGLE_PRIVATE_KEY_ID ||
        envVars.REACT_APP_GOOGLE_PRIVATE_KEY_ID,
      private_key: (
        envVars.GOOGLE_PRIVATE_KEY || envVars.REACT_APP_GOOGLE_PRIVATE_KEY
      )?.replace(/\\n/g, "\n"),
      client_email:
        envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
        envVars.REACT_APP_GOOGLE_CLIENT_EMAIL,
      client_id: envVars.GOOGLE_CLIENT_ID || envVars.REACT_APP_GOOGLE_CLIENT_ID,
      auth_uri:
        envVars.GOOGLE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri:
        envVars.GOOGLE_TOKEN_URI || "https://oauth2.googleapis.com/token",
    };

    // Khởi tạo auth
    const auth = new GoogleAuth({
      credentials: credentials,
      scopes: [scope],
    });

    // Lấy access token
    const authClient = await auth.getClient();
    const tokenResponse = await authClient.getAccessToken();

    if (tokenResponse.token) {
      return {
        enabled: true,
        token: tokenResponse.token.substring(0, 20) + "...",
      };
    }

    return {
      enabled: false,
      error: "Không thể lấy access token",
    };
  } catch (error) {
    // Phân tích lỗi để xác định API có được enable không
    const errorMsg = error.message.toLowerCase();

    if (
      errorMsg.includes("api not enabled") ||
      errorMsg.includes("has not been used") ||
      errorMsg.includes("not activated")
    ) {
      return {
        enabled: false,
        error: "API chưa được enable trong Google Cloud Console",
      };
    }

    if (
      errorMsg.includes("permission denied") ||
      errorMsg.includes("forbidden")
    ) {
      return {
        enabled: null, // Không chắc chắn - có thể là permission issue
        error: "Permission denied - API có thể đã enable nhưng thiếu quyền",
      };
    }

    return {
      enabled: null,
      error: error.message,
    };
  }
}

/**
 * Tìm các API được sử dụng trong code
 */
function findAPIsInCode() {
  const srcPath = path.join(__dirname, "..", "src");
  const automationPath = path.join(__dirname, "..", "automation");
  const foundAPIs = new Set();

  function searchInDirectory(dir, fileExtensions = [".js", ".jsx", ".py"]) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // Bỏ qua node_modules, venv, build, etc.
        if (!["node_modules", "venv", "build", ".git"].includes(file.name)) {
          searchInDirectory(fullPath, fileExtensions);
        }
      } else if (fileExtensions.some((ext) => file.name.endsWith(ext))) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");

          // Tìm các API references
          Object.keys(GOOGLE_APIS).forEach((apiKey) => {
            const api = GOOGLE_APIS[apiKey];

            // Kiểm tra scope
            if (content.includes(api.scope)) {
              foundAPIs.add(apiKey);
            }

            // Kiểm tra tên API
            if (
              content.includes(api.name.toLowerCase()) ||
              content.includes(apiKey)
            ) {
              foundAPIs.add(apiKey);
            }
          });

          // Kiểm tra Maps API
          if (
            content.includes("maps.googleapis.com") ||
            content.includes("GOOGLE_MAPS")
          ) {
            foundAPIs.add("maps.googleapis.com");
          }

          // Kiểm tra Apps Script
          if (
            content.includes("script.googleapis.com") ||
            content.includes("apps script") ||
            content.includes("apps-script")
          ) {
            foundAPIs.add("script.googleapis.com");
          }
        } catch (err) {
          // Bỏ qua lỗi đọc file
        }
      }
    }
  }

  searchInDirectory(srcPath);
  searchInDirectory(automationPath);

  return Array.from(foundAPIs);
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║  📊 KIỂM TRA GOOGLE APIs - MIA.vn Integration Platform     ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  console.log(`${colors.blue}Đang kiểm tra...${colors.reset}\n`);

  // 1. Tìm APIs trong code
  console.log(
    `${colors.cyan}1. Tìm kiếm APIs trong codebase...${colors.reset}`
  );
  const apisInCode = findAPIsInCode();
  console.log(`   Tìm thấy ${apisInCode.length} API references trong code\n`);

  // 2. Kiểm tra environment variables
  console.log(
    `${colors.cyan}2. Kiểm tra environment variables...${colors.reset}`
  );
  const envVars = getEnvVars();
  const hasCredentials = !!(
    envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    envVars.REACT_APP_GOOGLE_CLIENT_EMAIL ||
    envVars.GOOGLE_PRIVATE_KEY ||
    envVars.REACT_APP_GOOGLE_PRIVATE_KEY
  );

  if (hasCredentials) {
    console.log(
      `   ${colors.green}✅${colors.reset} Tìm thấy Google credentials`
    );
  } else {
    console.log(
      `   ${colors.yellow}⚠️${colors.reset} Không tìm thấy Google credentials trong .env`
    );
    console.log(
      `   ${colors.yellow}   Sẽ chỉ kiểm tra code, không thể test authentication${colors.reset}`
    );
  }
  console.log();

  // 3. Liệt kê các API đang được sử dụng
  console.log(
    `${colors.cyan}3. APIs đang được sử dụng trong code:${colors.reset}`
  );
  console.log(`${colors.bright}${"─".repeat(80)}${colors.reset}`);

  const results = [];

  for (const [apiKey, apiInfo] of Object.entries(GOOGLE_APIS)) {
    const isUsed = apisInCode.includes(apiKey) || apiInfo.required;
    const icon = isUsed ? "✅" : apiInfo.required ? "❌" : "⚪";
    const statusColor = isUsed
      ? colors.green
      : apiInfo.required
        ? colors.red
        : colors.yellow;

    console.log(`${statusColor}${icon}${colors.reset} ${apiInfo.name}`);
    console.log(`   API: ${apiKey}`);
    console.log(`   Scope: ${apiInfo.scope}`);
    console.log(`   Sử dụng trong: ${apiInfo.usedIn.join(", ")}`);
    if (apiInfo.note) {
      console.log(
        `   ${colors.yellow}📝 Lưu ý: ${apiInfo.note}${colors.reset}`
      );
    }

    // Kiểm tra xem API có được enable không
    if (hasCredentials && (isUsed || apiInfo.required)) {
      process.stdout.write(`   Đang kiểm tra trạng thái enable... `);
      const checkResult = await checkAPIEnabled(apiInfo.name, apiInfo.scope);

      if (checkResult.enabled === true) {
        console.log(`${colors.green}✅ ENABLED${colors.reset}`);
        results.push({
          api: apiInfo.name,
          status: "enabled",
          required: apiInfo.required,
        });
      } else if (checkResult.enabled === false) {
        console.log(`${colors.red}❌ NOT ENABLED${colors.reset}`);
        console.log(
          `   ${colors.red}   ⚠️  ${checkResult.error}${colors.reset}`
        );
        results.push({
          api: apiInfo.name,
          status: "not_enabled",
          required: apiInfo.required,
          error: checkResult.error,
        });
      } else {
        console.log(`${colors.yellow}⚠️  UNKNOWN${colors.reset}`);
        console.log(
          `   ${colors.yellow}   ${checkResult.error}${colors.reset}`
        );
        results.push({
          api: apiInfo.name,
          status: "unknown",
          required: apiInfo.required,
          error: checkResult.error,
        });
      }
    } else if (isUsed || apiInfo.required) {
      console.log(
        `   ${colors.yellow}⚠️  Chưa thể kiểm tra (thiếu credentials)${colors.reset}`
      );
      results.push({
        api: apiInfo.name,
        status: "not_checked",
        required: apiInfo.required,
      });
    } else {
      results.push({
        api: apiInfo.name,
        status: "not_used",
        required: apiInfo.required,
      });
    }

    console.log();
  }

  // 4. Tóm tắt
  console.log(`${colors.bright}${colors.cyan}4. TÓM TẮT${colors.reset}`);
  console.log(`${colors.bright}${"─".repeat(80)}${colors.reset}`);

  const missingRequired = results.filter(
    (r) => r.required && r.status !== "enabled"
  );
  const enabledRequired = results.filter(
    (r) => r.required && r.status === "enabled"
  );
  const optionalNotEnabled = results.filter(
    (r) => !r.required && r.status === "not_enabled"
  );

  console.log(
    `${colors.green}✅ APIs đã enable (required): ${enabledRequired.length}${colors.reset}`
  );
  enabledRequired.forEach((r) => {
    console.log(`   - ${r.api}`);
  });

  if (missingRequired.length > 0) {
    console.log(
      `\n${colors.red}❌ APIs CÒN THIẾU (required): ${missingRequired.length}${colors.reset}`
    );
    missingRequired.forEach((r) => {
      console.log(`   - ${r.api}`);
      if (r.error) {
        console.log(`     → ${r.error}`);
      }
    });
  }

  if (optionalNotEnabled.length > 0) {
    console.log(
      `\n${colors.yellow}⚠️  APIs optional chưa enable: ${optionalNotEnabled.length}${colors.reset}`
    );
    optionalNotEnabled.forEach((r) => {
      console.log(`   - ${r.api}`);
    });
  }

  // 5. Scopes đang được yêu cầu
  console.log(
    `\n${colors.cyan}5. SCOPES đang được yêu cầu trong code:${colors.reset}`
  );
  REQUIRED_SCOPES.forEach((scope) => {
    console.log(`   - ${scope}`);
  });

  // 6. Khuyến nghị
  console.log(
    `\n${colors.bright}${colors.magenta}6. KHUYẾN NGHỊ${colors.reset}`
  );
  console.log(`${colors.bright}${"─".repeat(80)}${colors.reset}`);

  if (missingRequired.length > 0) {
    console.log(`${colors.red}⚠️  CẦN HÀNH ĐỘNG NGAY:${colors.reset}`);
    console.log(`\nVui lòng enable các APIs sau trong Google Cloud Console:`);
    console.log(
      `🔗 https://console.cloud.google.com/apis/library?project=mia-logistics-469406\n`
    );

    missingRequired.forEach((r) => {
      const apiInfo = Object.values(GOOGLE_APIS).find((a) => a.name === r.api);
      if (apiInfo) {
        const apiKey = Object.keys(GOOGLE_APIS).find(
          (k) => GOOGLE_APIS[k].name === r.api
        );
        console.log(`   1. ${r.api}`);
        console.log(`      → Tìm "${apiInfo.name}" trong API Library`);
        console.log(`      → Click "ENABLE"`);
      }
    });
  } else {
    console.log(
      `${colors.green}✅ Tất cả APIs bắt buộc đã được enable!${colors.reset}`
    );
  }

  // Lưu kết quả vào file
  const reportPath = path.join(
    __dirname,
    "..",
    "google-apis-check-report.json"
  );
  const report = {
    timestamp: new Date().toISOString(),
    project: "mia-logistics-469406",
    results: results,
    summary: {
      total: results.length,
      enabled: enabledRequired.length,
      missing: missingRequired.length,
      optional: optionalNotEnabled.length,
    },
    scopes: REQUIRED_SCOPES,
    apisInCode: Array.from(apisInCode),
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(
    `\n${colors.blue}📄 Báo cáo chi tiết đã được lưu vào: ${reportPath}${colors.reset}\n`
  );
}

// Chạy script
main().catch((error) => {
  console.error(`${colors.red}❌ Lỗi: ${error.message}${colors.reset}`);
  console.error(error.stack);
  process.exit(1);
});
