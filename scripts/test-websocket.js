#!/usr/bin/env node
/**
 * WebSocket Connection Test
 * Test WebSocket connection giữa Frontend và Backend
 */

const io = require("socket.io-client");
require("dotenv").config();

console.log("🔌 WebSocket Connection Test");
console.log("=".repeat(70));

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const WEBSOCKET_URL = BACKEND_URL.replace(/^http/, "ws");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function print(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testWebSocketConnection() {
  return new Promise((resolve) => {
    print(`\n🔗 Connecting to: ${BACKEND_URL}`, "cyan");

    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      timeout: 5000,
      reconnection: false,
    });

    const results = {
      connected: false,
      welcomeReceived: false,
      dataUpdateReceived: false,
      aiResultReceived: false,
      disconnected: false,
      errors: [],
    };

    const timeout = setTimeout(() => {
      if (!results.connected) {
        print("   ❌ Connection timeout (5s)", "red");
        socket.disconnect();
        resolve(results);
      }
    }, 5000);

    // Connection successful
    socket.on("connect", () => {
      clearTimeout(timeout);
      results.connected = true;
      print("   ✅ Connected to WebSocket server", "green");
      print(`   📡 Socket ID: ${socket.id}`, "blue");

      // Request data after connection
      setTimeout(() => {
        print("\n📤 Requesting real-time data...", "cyan");
        socket.emit("request_data", {
          type: "dashboard",
          timestamp: new Date().toISOString(),
        });
      }, 500);

      // Request AI analysis
      setTimeout(() => {
        print("📤 Requesting AI analysis...", "cyan");
        socket.emit("ai_analysis", {
          data: [1, 2, 3, 4, 5],
          model: "test",
        });
      }, 1000);
    });

    // Welcome message
    socket.on("welcome", (data) => {
      results.welcomeReceived = true;
      print("   ✅ Received welcome message", "green");
      print(`   📨 Message: ${data.message}`, "blue");
      print(`   ⏰ Timestamp: ${data.timestamp}`, "blue");
    });

    // Data update
    socket.on("data_update", (data) => {
      results.dataUpdateReceived = true;
      print("   ✅ Received data update", "green");
      print(`   📊 Data:`, "blue");
      console.log(JSON.stringify(data, null, 2));
    });

    // AI result
    socket.on("ai_result", (data) => {
      results.aiResultReceived = true;
      print("   ✅ Received AI result", "green");
      print(`   🤖 AI Analysis:`, "blue");
      console.log(JSON.stringify(data, null, 2));
    });

    // Connection error
    socket.on("connect_error", (error) => {
      clearTimeout(timeout);
      const errorMsg = error.message || "Unknown error";
      results.errors.push(errorMsg);
      print(`   ❌ Connection error: ${errorMsg}`, "red");

      // Provide helpful error messages
      if (
        errorMsg.includes("ECONNREFUSED") ||
        errorMsg.includes("websocket error")
      ) {
        print(`   💡 Backend server may not be running`, "yellow");
        print(`   💡 Start backend with: cd backend && npm start`, "yellow");
        print(`   💡 Or use: npm run backend`, "yellow");
      } else if (errorMsg.includes("timeout")) {
        print(
          `   💡 Connection timeout - check if server is reachable`,
          "yellow"
        );
      }

      resolve(results);
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
      results.disconnected = true;
      print(`   ⚠️  Disconnected: ${reason}`, "yellow");
    });

    // Test completion timeout
    setTimeout(() => {
      if (results.connected) {
        socket.disconnect();

        // Summary
        print("\n" + "=".repeat(70));
        print("📊 TEST SUMMARY", "blue");
        print("=".repeat(70));

        const tests = [
          ["Connection", results.connected],
          ["Welcome Message", results.welcomeReceived],
          ["Data Update", results.dataUpdateReceived],
          ["AI Result", results.aiResultReceived],
        ];

        let passed = 0;
        let failed = 0;

        tests.forEach(([name, success]) => {
          if (success) {
            print(`   ✅ ${name}: PASSED`, "green");
            passed++;
          } else {
            print(`   ❌ ${name}: FAILED`, "red");
            failed++;
          }
        });

        print(`\n✅ Passed: ${passed}/${tests.length}`, "green");
        if (failed > 0) {
          print(`❌ Failed: ${failed}/${tests.length}`, "red");
        }

        if (results.errors.length > 0) {
          print("\n❌ Errors:", "red");
          results.errors.forEach((error) => {
            print(`   - ${error}`, "red");
          });
        }

        resolve(results);
      }
    }, 3000);
  });
}

async function runTest() {
  try {
    const results = await testWebSocketConnection();

    // Overall result
    const allPassed =
      results.connected &&
      results.welcomeReceived &&
      results.dataUpdateReceived &&
      results.aiResultReceived;

    print("\n" + "=".repeat(70));
    if (allPassed) {
      print("✅ ALL TESTS PASSED", "green");
      process.exit(0);
    } else {
      print("❌ SOME TESTS FAILED", "red");
      process.exit(1);
    }
  } catch (error) {
    print(`\n❌ Fatal error: ${error.message}`, "red");
    console.error(error);
    process.exit(1);
  }
}

// Check if socket.io-client is installed
try {
  require("socket.io-client");
  print("✅ socket.io-client found", "green");
} catch (error) {
  print("❌ socket.io-client not found. Installing...", "red");
  print("   Run: npm install socket.io-client", "yellow");
  process.exit(1);
}

// Check backend server before running test
async function checkBackendServer() {
  const http = require("http");
  const { URL } = require("url");

  return new Promise((resolve) => {
    const parsedUrl = new URL(BACKEND_URL);

    const req = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: "/health",
        method: "GET",
        timeout: 2000,
      },
      (res) => {
        resolve(true);
      }
    );

    req.on("error", () => {
      resolve(false);
    });

    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Main execution
async function main() {
  print("\n🔍 Checking backend server...", "cyan");

  const backendRunning = await checkBackendServer();

  if (!backendRunning) {
    print("   ❌ Backend server is not running!", "red");
    print("\n💡 To start backend server:", "yellow");
    print("   1. cd backend && npm start", "yellow");
    print("   2. Or: npm run backend", "yellow");
    print("   3. Or: npm run dev (starts all services)", "yellow");
    print("\n   Then run this test again.\n", "yellow");
    process.exit(1);
  }

  print("   ✅ Backend server is running", "green");
  print("   📍 URL: " + BACKEND_URL, "blue");

  // Run test
  await runTest();
}

main();
