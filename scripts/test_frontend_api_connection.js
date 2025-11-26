#!/usr/bin/env node
/**
 * Script kiểm tra kết nối Frontend với Backend API cho Google APIs
 * Usage: node scripts/test_frontend_api_connection.js
 */

const axios = require("axios");
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  bright: "\x1b[1m",
};

// API Base URL từ environment hoặc default
// Backend automation_bridge.py chạy tại port 8000
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api";

console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║  🔌 KIỂM TRA KẾT NỐI FRONTEND API - Google APIs            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

console.log(`${colors.blue}Backend API URL: ${API_BASE_URL}${colors.reset}\n`);

// Test results
const results = {
  backend: false,
  sheets: false,
  drive: false,
  errors: [],
};

/**
 * Test Backend API connection
 */
async function testBackendConnection() {
  console.log(
    `${colors.cyan}1. Kiểm tra Backend API Connection...${colors.reset}`
  );

  try {
    // Test root endpoint hoặc health check
    // Backend chạy tại port 8000, health endpoint là /health (không có /api)
    const baseUrl = API_BASE_URL.replace("/api", "");
    const endpoints = [
      `${baseUrl}/health`,
      `${baseUrl}/api/health`,
      `${baseUrl}`,
    ];

    let connected = false;
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint, {
          timeout: 5000,
          validateStatus: () => true, // Accept any status code
        });

        if (response.status < 500) {
          console.log(
            `   ${colors.green}✅${colors.reset} Backend đang chạy tại: ${endpoint}`
          );
          console.log(`   Status: ${response.status}`);
          connected = true;
          break;
        }
      } catch (err) {
        // Try next endpoint
      }
    }

    if (!connected) {
      throw new Error("Không thể kết nối đến backend");
    }

    results.backend = true;
    return true;
  } catch (error) {
    console.log(
      `   ${colors.red}❌${colors.reset} Không thể kết nối đến backend`
    );
    console.log(`   ${colors.red}   Lỗi: ${error.message}${colors.reset}`);
    console.log(
      `   ${colors.yellow}   → Đảm bảo backend đang chạy tại: ${API_BASE_URL}${colors.reset}`
    );
    results.errors.push({
      service: "Backend",
      error: error.message,
    });
    return false;
  }
}

/**
 * Test Google Sheets API endpoints
 */
async function testSheetsAPI() {
  console.log(
    `\n${colors.cyan}2. Kiểm tra Google Sheets API...${colors.reset}`
  );

  const endpoints = [
    { name: "Metadata", url: `${API_BASE_URL}/sheets/metadata`, method: "GET" },
    {
      name: "Read",
      url: `${API_BASE_URL}/sheets/read?range=A1:A1`,
      method: "GET",
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const config = {
        timeout: 10000,
        validateStatus: () => true,
      };

      const response =
        endpoint.method === "GET"
          ? await axios.get(endpoint.url, config)
          : await axios.post(endpoint.url, {}, config);

      if (response.status === 200) {
        console.log(
          `   ${colors.green}✅${colors.reset} ${endpoint.name}: OK (Status ${response.status})`
        );
        results.sheets = true;
      } else if (response.status === 401 || response.status === 403) {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: Authentication issue (Status ${response.status})`
        );
        console.log(
          `   ${colors.yellow}   → Kiểm tra Google credentials trong backend${colors.reset}`
        );
      } else if (response.status === 404) {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: Endpoint không tồn tại (Status ${response.status})`
        );
      } else {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: Status ${response.status}`
        );
        if (response.data?.error) {
          console.log(
            `   ${colors.yellow}   Error: ${response.data.error}${colors.reset}`
          );
        }
      }
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log(
          `   ${colors.red}❌${colors.reset} ${endpoint.name}: Không thể kết nối`
        );
        console.log(
          `   ${colors.red}   → Backend không chạy hoặc sai URL${colors.reset}`
        );
      } else {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: ${error.message}`
        );
      }
      results.errors.push({
        service: `Sheets ${endpoint.name}`,
        error: error.message,
      });
    }
  }
}

/**
 * Test Google Drive API endpoints
 */
async function testDriveAPI() {
  console.log(`\n${colors.cyan}3. Kiểm tra Google Drive API...${colors.reset}`);

  const endpoints = [
    {
      name: "List Files",
      url: `${API_BASE_URL}/drive/files?pageSize=1`,
      method: "GET",
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const config = {
        timeout: 10000,
        validateStatus: () => true,
      };

      const response =
        endpoint.method === "GET"
          ? await axios.get(endpoint.url, config)
          : await axios.post(endpoint.url, {}, config);

      if (response.status === 200) {
        console.log(
          `   ${colors.green}✅${colors.reset} ${endpoint.name}: OK (Status ${response.status})`
        );
        results.drive = true;
      } else if (response.status === 401 || response.status === 403) {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: Authentication issue (Status ${response.status})`
        );
        console.log(
          `   ${colors.yellow}   → Kiểm tra Google credentials trong backend${colors.reset}`
        );
      } else if (response.status === 404) {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: Endpoint không tồn tại (Status ${response.status})`
        );
      } else {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: Status ${response.status}`
        );
        if (response.data?.error) {
          console.log(
            `   ${colors.yellow}   Error: ${response.data.error}${colors.reset}`
          );
        }
      }
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log(
          `   ${colors.red}❌${colors.reset} ${endpoint.name}: Không thể kết nối`
        );
        console.log(
          `   ${colors.red}   → Backend không chạy hoặc sai URL${colors.reset}`
        );
      } else {
        console.log(
          `   ${colors.yellow}⚠️${colors.reset} ${endpoint.name}: ${error.message}`
        );
      }
      results.errors.push({
        service: `Drive ${endpoint.name}`,
        error: error.message,
      });
    }
  }
}

/**
 * Generate summary report
 */
function generateSummary() {
  console.log(`\n${colors.bright}${colors.cyan}4. TÓM TẮT${colors.reset}`);
  console.log(`${colors.bright}${"─".repeat(80)}${colors.reset}`);

  const totalTests = 3;
  const passedTests = [results.backend, results.sheets, results.drive].filter(
    Boolean
  ).length;

  console.log(`\n${colors.cyan}Kết quả kiểm tra:${colors.reset}`);
  console.log(
    `   Backend Connection: ${results.backend ? `${colors.green}✅ OK${colors.reset}` : `${colors.red}❌ FAILED${colors.reset}`}`
  );
  console.log(
    `   Google Sheets API: ${results.sheets ? `${colors.green}✅ OK${colors.reset}` : `${colors.yellow}⚠️  CHƯA XÁC NHẬN${colors.reset}`}`
  );
  console.log(
    `   Google Drive API: ${results.drive ? `${colors.green}✅ OK${colors.reset}` : `${colors.yellow}⚠️  CHƯA XÁC NHẬN${colors.reset}`}`
  );

  console.log(
    `\n${colors.cyan}Tỷ lệ thành công: ${passedTests}/${totalTests}${colors.reset}`
  );

  if (results.errors.length > 0) {
    console.log(`\n${colors.red}❌ Các lỗi phát hiện:${colors.reset}`);
    results.errors.forEach((err) => {
      console.log(`   - ${err.service}: ${err.error}`);
    });
  }

  // Recommendations
  console.log(`\n${colors.bright}${colors.cyan}5. KHUYẾN NGHỊ${colors.reset}`);
  console.log(`${colors.bright}${"─".repeat(80)}${colors.reset}`);

  if (!results.backend) {
    console.log(`\n${colors.red}⚠️  CẦN HÀNH ĐỘNG NGAY:${colors.reset}`);
    console.log(`\n1. Khởi động Backend API server:`);
    console.log(`   ${colors.blue}   cd backend && npm start${colors.reset}`);
    console.log(
      `   ${colors.blue}   hoặc: node backend/server.js${colors.reset}`
    );
    console.log(
      `\n2. Kiểm tra Backend đang chạy tại: ${colors.blue}${API_BASE_URL}${colors.reset}`
    );
    console.log(`\n3. Cấu hình Environment Variables trong Backend:`);
    console.log(`   - GOOGLE_SERVICE_ACCOUNT_EMAIL`);
    console.log(`   - GOOGLE_PRIVATE_KEY`);
    console.log(`   - GOOGLE_SHEETS_SPREADSHEET_ID`);
  } else {
    if (!results.sheets || !results.drive) {
      console.log(
        `\n${colors.yellow}⚠️  Một số API chưa hoạt động đúng:${colors.reset}`
      );
      console.log(`\n1. Kiểm tra Google credentials trong Backend`);
      console.log(`2. Đảm bảo Google APIs đã được enable:`);
      console.log(`   - Google Sheets API`);
      console.log(`   - Google Drive API`);
      console.log(`3. Kiểm tra Service Account có quyền truy cập Sheets/Drive`);
    } else {
      console.log(
        `\n${colors.green}✅ Tất cả API connections đang hoạt động tốt!${colors.reset}`
      );
      console.log(`\nFrontend có thể kết nối đến Backend API thành công.`);
    }
  }

  // Environment configuration
  console.log(
    `\n${colors.cyan}6. CẤU HÌNH ENVIRONMENT VARIABLES${colors.reset}`
  );
  console.log(`${colors.bright}${"─".repeat(80)}${colors.reset}`);
  console.log(
    `\nĐảm bảo các biến sau được cấu hình trong Frontend (.env hoặc .env.local):`
  );
  console.log(
    `\n${colors.blue}REACT_APP_API_BASE_URL=${API_BASE_URL}${colors.reset}`
  );
  console.log(`\nHoặc nếu dùng Vite:`);
  console.log(
    `\n${colors.blue}VITE_API_BASE_URL=${API_BASE_URL}${colors.reset}`
  );
}

/**
 * Main function
 */
async function main() {
  try {
    await testBackendConnection();

    if (results.backend) {
      await testSheetsAPI();
      await testDriveAPI();
    } else {
      console.log(
        `\n${colors.yellow}⚠️  Bỏ qua kiểm tra Google APIs vì Backend không kết nối được${colors.reset}`
      );
    }

    generateSummary();

    // Exit code
    const allPassed = results.backend && results.sheets && results.drive;
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error(
      `\n${colors.red}❌ Lỗi không mong đợi: ${error.message}${colors.reset}`
    );
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
main();
