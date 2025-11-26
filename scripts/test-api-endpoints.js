#!/usr/bin/env node
/**
 * API Endpoints Test
 * Test tất cả các API endpoints của backend và AI service
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");
require("dotenv").config();

console.log("🔗 API Endpoints Test");
console.log("=".repeat(70));

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const AI_SERVICE_URL =
  process.env.REACT_APP_AI_SERVICE_URL || "http://localhost:8000";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function print(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === "https:";
    const requestModule = isHttps ? https : http;

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const req = requestModule.request(requestOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData || data,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.setTimeout(options.timeout || 5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  try {
    print(`\n🧪 Testing: ${name}`, "cyan");
    print(`   URL: ${url}`, "blue");

    const startTime = Date.now();
    const response = await makeRequest(url, options);
    const duration = Date.now() - startTime;

    if (response.status >= 200 && response.status < 300) {
      print(`   ✅ SUCCESS (${response.status}) - ${duration}ms`, "green");
      return {
        success: true,
        status: response.status,
        duration,
        data: response.data,
      };
    } else {
      print(`   ⚠️  HTTP ${response.status} - ${duration}ms`, "yellow");
      return {
        success: false,
        status: response.status,
        duration,
        data: response.data,
      };
    }
  } catch (error) {
    print(`   ❌ ERROR: ${error.message}`, "red");
    return { success: false, error: error.message };
  }
}

async function runTests() {
  const results = [];

  // Backend API Tests
  print("\n📡 Backend API Endpoints", "blue");
  print("=".repeat(70));

  results.push(await testEndpoint("Health Check", `${API_BASE_URL}/health`));
  results.push(await testEndpoint("API Status", `${API_BASE_URL}/api/status`));
  results.push(await testEndpoint("Get Orders", `${API_BASE_URL}/api/orders`));
  results.push(
    await testEndpoint("Get Analytics", `${API_BASE_URL}/api/analytics`)
  );
  results.push(
    await testEndpoint("Get Statistics", `${API_BASE_URL}/api/statistics`)
  );

  // AI Service Tests
  print("\n🤖 AI Service Endpoints", "blue");
  print("=".repeat(70));

  results.push(
    await testEndpoint("AI Health Check", `${AI_SERVICE_URL}/health`)
  );
  results.push(await testEndpoint("AI Service Info", `${AI_SERVICE_URL}/`));
  results.push(
    await testEndpoint("AI Predictions", `${AI_SERVICE_URL}/api/predictions`)
  );
  results.push(
    await testEndpoint("AI Analytics", `${AI_SERVICE_URL}/api/analytics`)
  );

  // Summary
  print("\n" + "=".repeat(70));
  print("📊 TEST SUMMARY", "blue");
  print("=".repeat(70));

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

  print(`\n✅ Passed: ${passed}`, "green");
  print(`❌ Failed: ${failed}`, failed > 0 ? "red" : "green");
  print(`⏱️  Total Time: ${totalDuration}ms`);

  // Detailed results
  print("\n📋 Detailed Results:", "blue");
  results.forEach((result, index) => {
    const status = result.success ? "✅" : "❌";
    const duration = result.duration ? ` (${result.duration}ms)` : "";
    const statusText = result.status ? ` [${result.status}]` : "";
    print(
      `  ${index + 1}. ${status} ${
        result.name || `Test ${index + 1}`
      }${statusText}${duration}`
    );
  });

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  print(`\n❌ Fatal error: ${error.message}`, "red");
  process.exit(1);
});
