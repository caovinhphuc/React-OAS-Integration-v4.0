#!/usr/bin/env node

/**
 * Performance Bundle Analyzer - React OAS Integration v4.0
 * Phân tích chi tiết bundle size, dependencies và đề xuất cải thiện
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log("");
  log("━".repeat(70), "cyan");
  log(`  ${title}`, "bright");
  log("━".repeat(70), "cyan");
  console.log("");
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getSizeColor(bytes) {
  if (bytes > 500 * 1024) return "red"; // > 500KB
  if (bytes > 200 * 1024) return "yellow"; // > 200KB
  return "green";
}

// 1. Analyze Build Directory
function analyzeBuildDirectory() {
  header("📁 BUILD DIRECTORY ANALYSIS");

  const buildDir = "build";
  const jsDir = path.join(buildDir, "static", "js");
  const cssDir = path.join(buildDir, "static", "css");

  if (!fs.existsSync(buildDir)) {
    log("❌ Build directory not found!", "red");
    log("💡 Run: npm run build", "yellow");
    return null;
  }

  // Analyze JS files
  const jsFiles = [];
  if (fs.existsSync(jsDir)) {
    fs.readdirSync(jsDir).forEach((file) => {
      if (file.endsWith(".js") && !file.endsWith(".map")) {
        const filePath = path.join(jsDir, file);
        const stats = fs.statSync(filePath);
        jsFiles.push({
          name: file,
          path: filePath,
          size: stats.size,
          type: file.includes("main")
            ? "main"
            : file.includes("chunk")
            ? "chunk"
            : "vendor",
        });
      }
    });
  }

  // Analyze CSS files
  const cssFiles = [];
  if (fs.existsSync(cssDir)) {
    fs.readdirSync(cssDir).forEach((file) => {
      if (file.endsWith(".css") && !file.endsWith(".map")) {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        cssFiles.push({ name: file, path: filePath, size: stats.size });
      }
    });
  }

  // Sort by size
  jsFiles.sort((a, b) => b.size - a.size);
  cssFiles.sort((a, b) => b.size - a.size);

  // Display JS files
  log("📦 JavaScript Files:", "cyan");
  let totalJsSize = 0;
  jsFiles.forEach((file, index) => {
    totalJsSize += file.size;
    const color = getSizeColor(file.size);
    log(
      `  ${(index + 1).toString().padStart(2)}. ${file.name.padEnd(
        50
      )} ${formatSize(file.size).padStart(10)}`,
      color
    );
  });
  console.log("");
  log(
    `   Total JS: ${formatSize(totalJsSize)}`,
    totalJsSize > 2 * 1024 * 1024 ? "red" : "green"
  );

  // Display CSS files
  if (cssFiles.length > 0) {
    console.log("");
    log("🎨 CSS Files:", "cyan");
    let totalCssSize = 0;
    cssFiles.forEach((file, index) => {
      totalCssSize += file.size;
      const color = getSizeColor(file.size);
      log(
        `  ${(index + 1).toString().padStart(2)}. ${file.name.padEnd(
          50
        )} ${formatSize(file.size).padStart(10)}`,
        color
      );
    });
    console.log("");
    log(`   Total CSS: ${formatSize(totalCssSize)}`, "green");
  }

  console.log("");
  log(
    `📊 Total Bundle Size: ${formatSize(
      totalJsSize + cssFiles.reduce((sum, f) => sum + f.size, 0)
    )}`,
    "bright"
  );

  return { jsFiles, cssFiles, totalJsSize };
}

// 2. Analyze Dependencies
function analyzeDependencies() {
  header("📦 DEPENDENCY ANALYSIS");

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const deps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};

    // Known large libraries with their typical sizes
    const knownLibraries = {
      antd: {
        size: "~2MB",
        impact: "high",
        alternative: "Use tree-shaking, import specific components",
      },
      "@ant-design/icons": {
        size: "~500KB",
        impact: "high",
        alternative: "Import specific icons only",
      },
      react: {
        size: "~130KB",
        impact: "medium",
        alternative: "Required, but ensure production build",
      },
      "react-dom": {
        size: "~130KB",
        impact: "medium",
        alternative: "Required, but ensure production build",
      },
      axios: {
        size: "~15KB",
        impact: "low",
        alternative: "Good choice, lightweight",
      },
      redux: {
        size: "~20KB",
        impact: "low",
        alternative: "Consider Redux Toolkit for better DX",
      },
      "@reduxjs/toolkit": {
        size: "~50KB",
        impact: "medium",
        alternative: "Good choice",
      },
      "react-router-dom": {
        size: "~50KB",
        impact: "medium",
        alternative: "Required for routing",
      },
      moment: {
        size: "~70KB",
        impact: "high",
        alternative: "Replace with dayjs (~2KB) or date-fns",
      },
      lodash: {
        size: "~70KB",
        impact: "high",
        alternative: "Use lodash-es or import specific functions",
      },
      "chart.js": {
        size: "~200KB",
        impact: "high",
        alternative: "Consider recharts or lightweight alternatives",
      },
      recharts: {
        size: "~150KB",
        impact: "high",
        alternative: "Use lazy loading for charts",
      },
      googleapis: {
        size: "~500KB",
        impact: "high",
        alternative: "Consider backend proxy",
      },
      "socket.io-client": {
        size: "~100KB",
        impact: "medium",
        alternative: "Native WebSocket if possible",
      },
      "styled-components": {
        size: "~50KB",
        impact: "medium",
        alternative: "Consider CSS modules",
      },
    };

    log("🔍 Installed Large Dependencies:", "yellow");
    console.log("");

    let hasLargeDeps = false;
    Object.entries(knownLibraries).forEach(([lib, info]) => {
      if (deps[lib] || devDeps[lib]) {
        hasLargeDeps = true;
        const version = deps[lib] || devDeps[lib];
        const color =
          info.impact === "high"
            ? "red"
            : info.impact === "medium"
            ? "yellow"
            : "green";
        log(`  📦 ${lib.padEnd(30)} ${version.padEnd(15)} ${info.size}`, color);
        if (info.impact === "high") {
          log(`     💡 ${info.alternative}`, "dim");
        }
      }
    });

    if (!hasLargeDeps) {
      log("  ✅ No known large dependencies detected", "green");
    }

    // Count total dependencies
    console.log("");
    log(`📊 Total Dependencies: ${Object.keys(deps).length}`, "cyan");
    log(`📊 Total Dev Dependencies: ${Object.keys(devDeps).length}`, "cyan");

    return { deps, devDeps, knownLibraries };
  } catch (error) {
    log(`❌ Error reading package.json: ${error.message}`, "red");
    return null;
  }
}

// 3. Generate Recommendations
function generateRecommendations(buildAnalysis, depAnalysis) {
  header("💡 OPTIMIZATION RECOMMENDATIONS");

  const recommendations = [];
  let priority = 1;

  // Check bundle size
  if (buildAnalysis && buildAnalysis.totalJsSize > 2 * 1024 * 1024) {
    recommendations.push({
      priority: priority++,
      category: "Bundle Size",
      issue: `Large bundle size: ${formatSize(buildAnalysis.totalJsSize)}`,
      action: "Implement code splitting with React.lazy()",
      impact: "High",
      code: `
// Example:
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Reports = React.lazy(() => import('./pages/Reports'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/reports" element={<Reports />} />
  </Routes>
</Suspense>
      `.trim(),
    });
  }

  // Check for large chunks
  if (buildAnalysis && buildAnalysis.jsFiles) {
    const largeChunks = buildAnalysis.jsFiles.filter(
      (f) => f.size > 500 * 1024
    );
    if (largeChunks.length > 0) {
      recommendations.push({
        priority: priority++,
        category: "Large Chunks",
        issue: `${largeChunks.length} chunks > 500KB`,
        action: "Split large chunks into smaller pieces",
        impact: "High",
        files: largeChunks.map((f) => `${f.name} (${formatSize(f.size)})`),
      });
    }
  }

  // Check dependencies
  if (depAnalysis && depAnalysis.deps) {
    if (depAnalysis.deps["moment"]) {
      recommendations.push({
        priority: priority++,
        category: "Dependencies",
        issue: "moment.js is large (~70KB)",
        action: "Replace with dayjs (~2KB)",
        impact: "High",
        code: `
// Install: npm install dayjs
// Replace:
import dayjs from 'dayjs';
// Instead of: import moment from 'moment';
        `.trim(),
      });
    }

    if (depAnalysis.deps["lodash"] && !depAnalysis.deps["lodash-es"]) {
      recommendations.push({
        priority: priority++,
        category: "Dependencies",
        issue: "lodash doesn't support tree-shaking",
        action: "Use lodash-es or import specific functions",
        impact: "Medium",
        code: `
// Option 1: Use lodash-es
import { debounce, throttle } from 'lodash-es';

// Option 2: Import specific functions
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
        `.trim(),
      });
    }

    if (depAnalysis.deps["@ant-design/icons"]) {
      recommendations.push({
        priority: priority++,
        category: "Dependencies",
        issue: "@ant-design/icons is large",
        action: "Import specific icons only",
        impact: "Medium",
        code: `
// Instead of:
import * as Icons from '@ant-design/icons';

// Use:
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
        `.trim(),
      });
    }
  }

  // General recommendations
  recommendations.push({
    priority: priority++,
    category: "Build Optimization",
    issue: "Ensure production optimizations",
    action: "Verify production build settings",
    impact: "High",
    steps: [
      "✓ NODE_ENV=production",
      "✓ Minification enabled",
      "✓ Source maps disabled (or external)",
      "✓ Tree-shaking enabled",
      "✓ Compression (gzip/brotli)",
    ],
  });

  recommendations.push({
    priority: priority++,
    category: "Performance",
    issue: "Optimize asset loading",
    action: "Implement lazy loading strategies",
    impact: "Medium",
    steps: [
      "✓ Lazy load images with loading='lazy'",
      "✓ Use dynamic imports for routes",
      "✓ Defer non-critical CSS",
      "✓ Preload critical resources",
    ],
  });

  // Display recommendations
  recommendations.forEach((rec) => {
    console.log("");
    log(
      `${rec.priority}. ${rec.category}: ${rec.issue}`,
      rec.impact === "High" ? "red" : "yellow"
    );
    log(`   Action: ${rec.action}`, "cyan");
    log(`   Impact: ${rec.impact}`, rec.impact === "High" ? "red" : "yellow");

    if (rec.code) {
      console.log("");
      log("   Code Example:", "dim");
      rec.code.split("\n").forEach((line) => {
        log(`   ${line}`, "dim");
      });
    }

    if (rec.files) {
      console.log("");
      log("   Affected Files:", "dim");
      rec.files.forEach((file) => {
        log(`   • ${file}`, "dim");
      });
    }

    if (rec.steps) {
      console.log("");
      log("   Steps:", "dim");
      rec.steps.forEach((step) => {
        log(`   ${step}`, "dim");
      });
    }
  });
}

// 4. Check for unused dependencies
function checkUnusedDependencies() {
  header("🔍 UNUSED DEPENDENCIES CHECK");

  log("💡 Running depcheck to find unused dependencies...", "cyan");
  console.log("");

  try {
    // Check if depcheck is installed
    try {
      execSync("npx depcheck --version", { stdio: "ignore" });
    } catch {
      log("📦 Installing depcheck...", "yellow");
      execSync("npm install -g depcheck", { stdio: "inherit" });
    }

    // Run depcheck
    const result = execSync("npx depcheck --json", { encoding: "utf8" });
    const depcheckResult = JSON.parse(result);

    if (depcheckResult.dependencies && depcheckResult.dependencies.length > 0) {
      log("⚠️  Unused Dependencies Found:", "yellow");
      depcheckResult.dependencies.forEach((dep) => {
        log(`  • ${dep}`, "yellow");
      });
      console.log("");
      log("💡 Consider removing these with: npm uninstall <package>", "cyan");
    } else {
      log("✅ No unused dependencies found!", "green");
    }

    if (
      depcheckResult.devDependencies &&
      depcheckResult.devDependencies.length > 0
    ) {
      console.log("");
      log("⚠️  Unused Dev Dependencies Found:", "yellow");
      depcheckResult.devDependencies.forEach((dep) => {
        log(`  • ${dep}`, "yellow");
      });
    }
  } catch (error) {
    log("⚠️  Could not run depcheck", "yellow");
    log("💡 Install manually: npm install -g depcheck", "dim");
  }
}

// 5. Generate Action Plan
function generateActionPlan() {
  header("🎯 ACTION PLAN");

  log("Immediate Actions (Do Now):", "red");
  log("  1. npm run build -- --stats", "cyan");
  log("  2. npm run analyze (opens bundle visualizer)", "cyan");
  log("  3. Review largest chunks in build/static/js/", "cyan");
  console.log("");

  log("Short-term (This Week):", "yellow");
  log("  1. Implement React.lazy() for routes", "cyan");
  log("  2. Replace moment.js with dayjs", "cyan");
  log("  3. Optimize Ant Design imports", "cyan");
  log("  4. Remove unused dependencies", "cyan");
  console.log("");

  log("Long-term (This Month):", "green");
  log("  1. Implement comprehensive code splitting", "cyan");
  log("  2. Set up bundle size monitoring", "cyan");
  log("  3. Configure CDN for static assets", "cyan");
  log("  4. Implement service worker for caching", "cyan");
  console.log("");

  log("📚 Useful Commands:", "cyan");
  log("  npm run perf:bundle        # This analysis", "dim");
  log("  npm run analyze            # Visual bundle analyzer", "dim");
  log("  npm run build -- --stats   # Generate webpack stats", "dim");
  log("  npx depcheck               # Find unused deps", "dim");
  log(
    "  npx source-map-explorer build/static/js/*.js  # Detailed analysis",
    "dim"
  );
}

// Main function
function main() {
  console.log("");
  log(
    "╔══════════════════════════════════════════════════════════════════╗",
    "cyan"
  );
  log(
    "║     🚀 Performance Bundle Analyzer - React OAS Integration      ║",
    "bright"
  );
  log(
    "╚══════════════════════════════════════════════════════════════════╝",
    "cyan"
  );

  const buildAnalysis = analyzeBuildDirectory();
  const depAnalysis = analyzeDependencies();

  if (buildAnalysis && depAnalysis) {
    generateRecommendations(buildAnalysis, depAnalysis);
  }

  checkUnusedDependencies();
  generateActionPlan();

  console.log("");
  log("━".repeat(70), "cyan");
  log("  ✨ Analysis Complete! Review recommendations above.", "bright");
  log("━".repeat(70), "cyan");
  console.log("");
}

if (require.main === module) {
  main();
}

module.exports = { main };
