#!/usr/bin/env node
/**
 * Automation System Test
 * Test các chức năng của Automation System (Python FastAPI)
 */

const http = require("http");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

console.log("🤖 Automation System Test");
console.log("=".repeat(70));

const AUTOMATION_API_URL =
  process.env.REACT_APP_AUTOMATION_API_URL || "http://localhost:8001";
const PYTHON_CMD = process.env.PYTHON_CMD || "python3";

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

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const req = http.request(requestOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            data: jsonData || data,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
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

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  try {
    print(`\n🧪 Testing: ${name}`, "cyan");
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
      return { success: false, status: response.status, duration };
    }
  } catch (error) {
    print(`   ❌ ERROR: ${error.message}`, "red");
    return { success: false, error: error.message };
  }
}

function checkPythonEnvironment() {
  return new Promise((resolve) => {
    print("\n🐍 Checking Python Environment...", "blue");

    const pythonProcess = spawn(PYTHON_CMD, ["--version"]);
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        print(`   ✅ Python found: ${output.trim()}`, "green");
        resolve(true);
      } else {
        print(`   ❌ Python not found or error`, "red");
        resolve(false);
      }
    });

    pythonProcess.on("error", () => {
      print(`   ❌ Cannot execute ${PYTHON_CMD}`, "red");
      resolve(false);
    });
  });
}

function checkAutomationFiles() {
  print("\n📁 Checking Automation Files...", "blue");

  const automationDir = path.join(__dirname, "..", "one_automation_system");
  const mainFile = path.join(automationDir, "main.py");
  const bridgeFile = path.join(automationDir, "automation_bridge.py");

  const results = {
    directory: fs.existsSync(automationDir),
    mainFile: fs.existsSync(mainFile),
    bridgeFile: fs.existsSync(bridgeFile),
  };

  if (results.directory) {
    print(`   ✅ Automation directory exists`, "green");
  } else {
    print(`   ❌ Automation directory not found`, "red");
  }

  if (results.mainFile) {
    print(`   ✅ main.py exists`, "green");
  } else {
    print(`   ⚠️  main.py not found`, "yellow");
  }

  if (results.bridgeFile) {
    print(`   ✅ automation_bridge.py exists`, "green");
  } else {
    print(`   ⚠️  automation_bridge.py not found`, "yellow");
  }

  return results;
}

async function runTests() {
  const results = {
    python: await checkPythonEnvironment(),
    files: checkAutomationFiles(),
    endpoints: [],
  };

  // Test Automation API Endpoints
  print("\n🔗 Automation API Endpoints", "blue");
  print("=".repeat(70));

  results.endpoints.push(
    await testEndpoint("Health Check", `${AUTOMATION_API_URL}/health`)
  );
  results.endpoints.push(
    await testEndpoint("API Status", `${AUTOMATION_API_URL}/`)
  );
  results.endpoints.push(
    await testEndpoint("Get Orders", `${AUTOMATION_API_URL}/api/orders`)
  );
  results.endpoints.push(
    await testEndpoint(
      "Automation Status",
      `${AUTOMATION_API_URL}/api/automation/status`
    )
  );

  // Summary
  print("\n" + "=".repeat(70));
  print("📊 TEST SUMMARY", "blue");
  print("=".repeat(70));

  const endpointsPassed = results.endpoints.filter((r) => r.success).length;
  const endpointsFailed = results.endpoints.filter((r) => !r.success).length;

  print(
    `\n🐍 Python Environment: ${results.python ? "✅ OK" : "❌ Not Found"}`
  );
  print(
    `📁 Files Check: ${
      results.files.mainFile && results.files.bridgeFile
        ? "✅ OK"
        : "⚠️  Incomplete"
    }`
  );
  print(`\n✅ Endpoints Passed: ${endpointsPassed}`, "green");
  print(
    `❌ Endpoints Failed: ${endpointsFailed}`,
    endpointsFailed > 0 ? "red" : "green"
  );

  // Detailed results
  if (results.endpoints.length > 0) {
    print("\n📋 Endpoint Results:", "blue");
    results.endpoints.forEach((result, index) => {
      const status = result.success ? "✅" : "❌";
      const duration = result.duration ? ` (${result.duration}ms)` : "";
      print(
        `  ${index + 1}. ${status} ${
          result.name || `Endpoint ${index + 1}`
        }${duration}`
      );
    });
  }

  const allPassed =
    results.python && endpointsPassed === results.endpoints.length;
  process.exit(allPassed ? 0 : 1);
}

runTests().catch((error) => {
  print(`\n❌ Fatal error: ${error.message}`, "red");
  process.exit(1);
});
