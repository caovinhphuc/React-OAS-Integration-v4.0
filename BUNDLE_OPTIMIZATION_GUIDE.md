# 📦 Bundle Optimization Guide - React OAS Integration v4.0

## 📋 Tổng Quan

Hướng dẫn toàn diện về tối ưu hóa bundle size cho React OAS Integration v4.0. Guide này bao gồm strategies, best practices, và tools để giảm bundle size và cải thiện performance.

## 🎯 Mục Tiêu Tối Ưu

### Lợi ích chính

- ⚡ **Tốc độ tải trang** - Giảm 50-70% load time
- 📱 **Trải nghiệm mobile** - Tốt hơn trên mạng chậm
- 💰 **Chi phí bandwidth** - Tiết kiệm data transfer
- 🚀 **Performance tổng thể** - Lighthouse score > 90
- 🌍 **SEO & Accessibility** - Tốt hơn cho search engines
- 💻 **User Experience** - Faster Time to Interactive (TTI)

### Metrics mục tiêu

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Main Bundle | < 200 KB | 675 KB | ⚠️ Needs optimization |
| Total JS | < 1 MB | 2.38 MB | ⚠️ Needs optimization |
| CSS | < 100 KB | 81 KB | ✅ Good |
| Load Time | < 2s | ~4s | ⚠️ Needs optimization |
| Lighthouse | > 90 | ~65 | ⚠️ Needs optimization |

---

## 📊 Phân Tích Bundle

### 1. Chạy Bundle Analyzer

```bash
# 🎯 RECOMMENDED: Phân tích toàn diện
npm run perf:bundle

# 📊 Visual analysis với treemap
npm run analyze

# 🔍 Kiểm tra dependencies không dùng
npm run perf:deps
npx depcheck

# 📏 Kiểm tra size limits
npm run perf:size

# 🗺️ Source map explorer (chi tiết từng file)
npx source-map-explorer build/static/js/*.js

# 📦 Webpack bundle analyzer
npm run build -- --stats
npx webpack-bundle-analyzer build/bundle-stats.json
```

### 2. Hiểu Bundle Structure

```
build/
├── static/
│   ├── js/
│   │   ├── main.[hash].js           # Main application code (~675 KB)
│   │   ├── [number].[hash].chunk.js # Code-split chunks (39 files)
│   │   ├── runtime-main.[hash].js   # Webpack runtime (~5 KB)
│   │   └── *.js.map                 # Source maps (optional)
│   ├── css/
│   │   ├── main.[hash].css          # Compiled CSS (~81 KB)
│   │   └── *.css.map                # CSS source maps
│   └── media/
│       └── [name].[hash].[ext]      # Images, fonts, etc.
├── index.html                        # Entry point
├── manifest.json                     # PWA manifest
└── asset-manifest.json               # Asset mapping
```

### 3. Phân Tích Chi Tiết

#### Top Dependencies (Largest)

```bash
# Check installed package sizes
npx bundlephobia [package-name]

# Or use the analyzer output
npm run perf:bundle
```

**Current large dependencies:**

| Package | Size | Impact | Recommendation |
|---------|------|--------|----------------|
| `antd` | ~2 MB | High | ✅ Use tree-shaking, import specific components |
| `@ant-design/icons` | ~500 KB | High | ⚠️ Import specific icons only |
| `googleapis` | ~500 KB | High | 🔄 Move to backend proxy |
| `recharts` | ~150 KB | Medium | ✅ Use lazy loading |
| `socket.io-client` | ~100 KB | Medium | ✅ Keep (essential) |
| `react` + `react-dom` | ~260 KB | Low | ✅ Keep (core) |

---

## 🔧 Optimization Strategies

### 1. Code Splitting (Ưu tiên cao - Impact: 🔴 High)

Code splitting là kỹ thuật quan trọng nhất để giảm bundle size. Thay vì load toàn bộ app, chỉ load những gì cần thiết.

#### A. Route-based Splitting

**✅ Đã implement trong App.jsx:**

```javascript
// src/App.jsx - CURRENT IMPLEMENTATION
import React, { Suspense, lazy } from 'react';
import Loading from './components/Common/Loading';

// ✅ All routes are already lazy loaded
const LiveDashboard = lazy(() => import('./components/Dashboard/LiveDashboard'));
const AIDashboard = lazy(() => import('./components/ai/AIDashboard'));
const GoogleSheetsIntegration = lazy(() => import('./components/google/GoogleSheetsIntegration'));
const TelegramIntegration = lazy(() => import('./components/telegram/TelegramIntegration'));
// ... more routes

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<LiveDashboard />} />
        <Route path="/ai-analytics" element={<AIDashboard />} />
        {/* ... more routes */}
      </Routes>
    </Suspense>
  );
}
```

**Impact:** Giảm main bundle từ ~850KB xuống ~675KB (↓ 20%)

#### B. Component-based Splitting

Split các components nặng (charts, editors, modals):

```javascript
// ❌ BAD: Import heavy component directly
import RichTextEditor from './components/RichTextEditor';
import AdvancedChart from './components/AdvancedChart';

// ✅ GOOD: Lazy load heavy components
const RichTextEditor = React.lazy(() => import('./components/RichTextEditor'));
const AdvancedChart = React.lazy(() => import('./components/AdvancedChart'));

function Dashboard() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Only load chart when visible */}
      <Suspense fallback={<Skeleton />}>
        <AdvancedChart data={data} />
      </Suspense>

      {/* Only load editor when needed */}
      {showEditor && (
        <Suspense fallback={<Spinner />}>
          <RichTextEditor />
        </Suspense>
      )}
    </div>
  );
}
```

#### C. Feature-based Splitting

Split theo features/modules:

```javascript
// ❌ BAD: Import all features
import { FeatureA, FeatureB, FeatureC } from './features';

// ✅ GOOD: Lazy load features
const FeatureA = React.lazy(() => import('./features/FeatureA'));
const FeatureB = React.lazy(() => import('./features/FeatureB'));
const FeatureC = React.lazy(() => import('./features/FeatureC'));

function App() {
  const [activeFeature, setActiveFeature] = useState('A');

  return (
    <Suspense fallback={<Loading />}>
      {activeFeature === 'A' && <FeatureA />}
      {activeFeature === 'B' && <FeatureB />}
      {activeFeature === 'C' && <FeatureC />}
    </Suspense>
  );
}
```

#### D. Preloading Strategy

Preload routes khi user hover:

```javascript
// Preload component on hover
const preloadComponent = (componentLoader) => {
  const component = componentLoader();
  // Component is now preloaded
};

function Navigation() {
  return (
    <nav>
      <Link
        to="/dashboard"
        onMouseEnter={() => preloadComponent(() => import('./pages/Dashboard'))}
      >
        Dashboard
      </Link>
    </nav>
  );
}
```

#### E. Webpack Magic Comments

Customize chunk names và loading:

```javascript
// Named chunks
const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: "dashboard" */ './pages/Dashboard')
);

// Prefetch (load in idle time)
const Settings = React.lazy(() =>
  import(/* webpackPrefetch: true */ './pages/Settings')
);

// Preload (load in parallel)
const Profile = React.lazy(() =>
  import(/* webpackPreload: true */ './pages/Profile')
);
```

**Expected Results:**

- Main bundle: 675KB → ~300KB (↓ 55%)
- Initial load: Only critical code
- Subsequent loads: On-demand chunks

---

### 2. Optimize Dependencies (Impact: 🔴 High)

#### A. Replace Large Libraries

**✅ Đã thực hiện: moment.js → dayjs**

```bash
# ❌ moment.js (~70KB gzipped)
npm uninstall moment

# ✅ dayjs (~2KB gzipped) - Đã cài
npm install dayjs
```

```javascript
// Before (moment.js)
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');
const relative = moment(date).fromNow();

// After (dayjs) - Đã migrate
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const date = dayjs().format('YYYY-MM-DD');
const relative = dayjs(date).fromNow();
```

**Impact:** Giảm ~68KB (moment → dayjs)

#### B. Optimize Lodash

```bash
# ❌ lodash (full bundle ~70KB)
# ✅ lodash-es (tree-shakeable)
npm install lodash-es
```

```javascript
// ❌ BAD: Imports entire lodash (~70KB)
import _ from 'lodash';
const result = _.debounce(fn, 300);
const sorted = _.sortBy(array, 'name');

// ✅ GOOD: Import specific functions (~5KB per function)
import { debounce, sortBy } from 'lodash-es';
const result = debounce(fn, 300);
const sorted = sortBy(array, 'name');

// ✅ BETTER: Import from specific path (smallest)
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
const result = debounce(fn, 300);
const sorted = sortBy(array, 'name');

// ✅ BEST: Native alternatives (0KB)
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
```

**Impact:** Giảm ~50-60KB nếu thay thế bằng native

#### C. Optimize Ant Design (🔴 Critical - ~2MB)

**Current status:** antd@5.29.1 (~2MB uncompressed)

```javascript
// ❌ BAD: Import all icons (~500KB)
import * as Icons from '@ant-design/icons';
const icon = <Icons.UserOutlined />;

// ✅ GOOD: Import specific icons (~5KB per icon)
import { UserOutlined, SettingOutlined, DashboardOutlined } from '@ant-design/icons';

// ❌ BAD: Import entire antd
import antd from 'antd';

// ✅ GOOD: Import specific components (tree-shaking works)
import { Button, Modal, Form, Table } from 'antd';

// ✅ BETTER: Use babel-plugin-import for auto tree-shaking
// In .babelrc or craco.config.js:
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": "css"
    }]
  ]
}
```

**Audit current icon usage:**

```bash
# Find all icon imports
grep -r "@ant-design/icons" src/ --include="*.jsx" --include="*.js"

# Count unique icons
grep -r "@ant-design/icons" src/ --include="*.jsx" | sed 's/.*import.*{\(.*\)}.*/\1/' | tr ',' '\n' | sort | uniq | wc -l
```

**Impact:** Giảm ~400-450KB nếu chỉ import icons cần thiết

#### D. Optimize Other Large Dependencies

**googleapis (~500KB) - 🔄 Move to Backend**

```javascript
// ❌ BAD: Import googleapis in frontend
import { google } from 'googleapis';

// ✅ GOOD: Use backend proxy
// Frontend:
const response = await fetch('/api/google-sheets', {
  method: 'POST',
  body: JSON.stringify({ action: 'read', sheetId })
});

// Backend (backend/routes/google.js):
const { google } = require('googleapis');
// Handle Google API calls here
```

**Impact:** Giảm ~500KB từ frontend bundle

**recharts (~150KB) - ✅ Lazy load**

```javascript
// ❌ BAD: Import directly
import { LineChart, BarChart } from 'recharts';

// ✅ GOOD: Lazy load charts
const Charts = React.lazy(() => import('./components/Charts'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <Charts data={data} />
    </Suspense>
  );
}
```

**Impact:** Charts chỉ load khi cần (~150KB)

#### E. Remove Unused Dependencies

**✅ Đã xóa:**

- `ajv` (không dùng)
- `lucide-react` (không dùng)
- `styled-components` (không dùng)
- `cors`, `express` (chuyển sang backend)

```bash
# Check for more unused dependencies
npx depcheck

# Remove unused packages
npm uninstall <package-name>
```

**Impact:** Đã giảm ~79 packages

#### F. Bundle Analysis per Dependency

```bash
# Check size of specific package
npx bundlephobia antd
npx bundlephobia @ant-design/icons
npx bundlephobia recharts

# Compare alternatives
npx bundlephobia moment vs dayjs
npx bundlephobia lodash vs lodash-es
```

---

### 3. Tree Shaking (Impact: 🟡 Medium)

Tree shaking loại bỏ code không sử dụng. Đảm bảo code của bạn tree-shakeable:

#### A. Use Named Exports

```javascript
// ✅ GOOD: Named exports (tree-shakeable)
// utils/helpers.js
export const formatDate = (date) => { /* ... */ };
export const formatCurrency = (amount) => { /* ... */ };
export const formatNumber = (num) => { /* ... */ };

// Usage - only imports what's needed
import { formatDate, formatCurrency } from './utils/helpers';

// ❌ BAD: Default export of object (not tree-shakeable)
// utils/helpers.js
export default {
  formatDate: (date) => { /* ... */ },
  formatCurrency: (amount) => { /* ... */ },
  formatNumber: (num) => { /* ... */ },
};

// Usage - imports entire object
import helpers from './utils/helpers';
helpers.formatDate(date);
```

#### B. Avoid Side Effects

```javascript
// ✅ GOOD: Pure modules (tree-shakeable)
// utils/math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// ❌ BAD: Module with side effects (not tree-shakeable)
// utils/math.js
console.log('Math utils loaded'); // Side effect!
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

#### C. Configure package.json

```json
{
  "sideEffects": false,
  // Or specify files with side effects
  "sideEffects": [
    "*.css",
    "*.scss",
    "src/polyfills.js"
  ]
}
```

#### D. Verify Tree Shaking

```bash
# Build and check bundle
npm run build

# Analyze what's included
npx source-map-explorer build/static/js/main.*.js

# Check if unused code is removed
grep -r "unusedFunction" build/static/js/
```

---

### 4. Dynamic Imports (Impact: 🟡 Medium)

Load code chỉ khi cần thiết:

#### A. Import Heavy Libraries Dynamically

```javascript
// ❌ BAD: Import large library upfront
import { parse } from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

function DataTools() {
  const handleImportCSV = (file) => {
    const result = parse(file);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.save('report.pdf');
  };
}

// ✅ GOOD: Dynamic import when needed
function DataTools() {
  const handleImportCSV = async (file) => {
    const { parse } = await import('papaparse');
    const result = parse(file);
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.save('report.pdf');
  };

  const handleExportExcel = async (data) => {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    // ... export logic
  };
}
```

**Impact:** Giảm initial bundle, load libraries chỉ khi user sử dụng tính năng

#### B. Conditional Imports

```javascript
// Load polyfills only for old browsers
async function loadPolyfills() {
  if (typeof Promise === 'undefined') {
    await import('promise-polyfill');
  }

  if (!Array.prototype.includes) {
    await import('core-js/features/array/includes');
  }
}

// Load analytics only in production
if (process.env.NODE_ENV === 'production') {
  import('./analytics').then(({ init }) => init());
}
```

#### C. User Interaction Imports

```javascript
// Load modal content only when opened
function App() {
  const [showModal, setShowModal] = useState(false);
  const [ModalContent, setModalContent] = useState(null);

  const openModal = async () => {
    const { default: Content } = await import('./components/HeavyModal');
    setModalContent(() => Content);
    setShowModal(true);
  };

  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      {showModal && ModalContent && <ModalContent />}
    </>
  );
}
```

---

### 5. Build Configuration (Impact: 🔴 High)

#### A. Environment Variables (.env.production)

**✅ Đã cấu hình:**

```bash
# Disable source maps in production (saves ~50% size)
GENERATE_SOURCEMAP=false

# Enable production mode
NODE_ENV=production

# Optimize images (inline small images)
IMAGE_INLINE_SIZE_LIMIT=10000

# Disable ESLint in production build
DISABLE_ESLINT_PLUGIN=true

# Inline runtime chunk
INLINE_RUNTIME_CHUNK=false
```

**Impact:** Giảm ~40-50% bundle size

#### B. Package.json Scripts

```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:prod": "GENERATE_SOURCEMAP=false react-scripts build",
    "build:analyze": "npm run build -- --stats",
    "analyze": "source-map-explorer build/static/js/main.*.js",
    "perf:bundle": "node scripts/perf-bundle-analyzer.js",
    "perf:deps": "npx depcheck",
    "perf:size": "npx size-limit"
  }
}
```

#### C. Webpack Optimization (via CRACO)

Nếu cần custom webpack config, sử dụng CRACO:

```bash
npm install @craco/craco
```

```javascript
// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Optimize chunks
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Ant Design chunk
            antd: {
              test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
              name: 'antd',
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
        runtimeChunk: 'single',
      };

      return webpackConfig;
    },
  },
};
```

#### D. Compression

Enable gzip/brotli compression:

```bash
# Install compression middleware
npm install compression

# In backend server.js
const compression = require('compression');
app.use(compression());
```

**Or use Vercel/Netlify automatic compression**

#### E. Asset Optimization

```javascript
// Optimize images
import imageCompression from 'browser-image-compression';

async function handleImageUpload(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

// Lazy load images
<img
  src={imageUrl}
  loading="lazy"
  alt="description"
/>

// Use modern formats
<picture>
  <source srcSet={imageWebP} type="image/webp" />
  <source srcSet={imageJpg} type="image/jpeg" />
  <img src={imageFallback} alt="description" />
</picture>
```

---

## 📏 Bundle Size Targets & Metrics

### Recommended Limits (Gzipped)

| Asset Type | Excellent | Good | Warning | Critical | Current |
|-----------|-----------|------|---------|----------|---------|
| Main JS | < 100 KB | < 200 KB | 200-500 KB | > 500 KB | **675 KB** ⚠️ |
| Total JS | < 500 KB | < 1 MB | 1-2 MB | > 2 MB | **2.38 MB** ⚠️ |
| CSS | < 50 KB | < 100 KB | 100-200 KB | > 200 KB | **81 KB** ✅ |
| Images | < 200 KB | < 500 KB | 500 KB-1 MB | > 1 MB | **N/A** |
| Fonts | < 100 KB | < 200 KB | 200-500 KB | > 500 KB | **N/A** |

### Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| First Contentful Paint (FCP) | < 1.8s | ~3.5s | ⚠️ |
| Largest Contentful Paint (LCP) | < 2.5s | ~4.2s | ⚠️ |
| Time to Interactive (TTI) | < 3.8s | ~5.5s | ⚠️ |
| Total Blocking Time (TBT) | < 200ms | ~450ms | ⚠️ |
| Cumulative Layout Shift (CLS) | < 0.1 | ~0.05 | ✅ |
| Speed Index | < 3.4s | ~4.8s | ⚠️ |
| Lighthouse Score | > 90 | ~65 | ⚠️ |

### Network Performance

| Connection | Target Load Time | Current | Status |
|------------|------------------|---------|--------|
| Fast 4G | < 2s | ~2.8s | ⚠️ |
| Slow 4G | < 5s | ~8.5s | ❌ |
| 3G | < 10s | ~15s | ❌ |
| Cable/DSL | < 1.5s | ~2.2s | ⚠️ |

### Current Status

```bash
# Run comprehensive analysis
npm run perf:bundle

# Quick check
npm run build && du -sh build/static/js/main.*.js
```

**Latest Analysis (Dec 11, 2025):**

- Main Bundle: 675 KB
- Total Chunks: 39 files
- Total JS: 2.38 MB
- Total CSS: 81.10 KB
- Build Size: 116 MB (with assets)

---

## 🔍 Monitoring

### 1. Size Limit

Tự động kiểm tra bundle size trong CI/CD:

```bash
npm run perf:size
```

### 2. Bundle Analyzer

Visual analysis:

```bash
npm run analyze
```

### 3. Lighthouse

Performance audit:

```bash
npx lighthouse https://your-app.com --view
```

---

## 🚀 Action Plan & Quick Wins

### ✅ Completed (Dec 11, 2025)

1. **✅ Route-based Code Splitting**
   - All routes using React.lazy()
   - Suspense boundaries implemented
   - Impact: ↓ 20% main bundle

2. **✅ Removed Unused Dependencies**
   - Removed: ajv, lucide-react, styled-components, sharp
   - Removed: cors, express (moved to backend)
   - Removed: @testing-library/user-event, jest-environment-jsdom
   - Impact: ↓ 79 packages

3. **✅ Replaced moment.js with dayjs**
   - Installed dayjs (~2KB vs ~70KB)
   - Impact: ↓ 68KB

4. **✅ Build Configuration**
   - Created .env.production
   - Disabled source maps
   - Optimized build settings
   - Impact: ↓ 40-50% build size

### 🔄 In Progress

1. **🔄 Optimize Ant Design Icons**

   ```bash
   # Audit current icon usage
   grep -r "from '@ant-design/icons'" src/ | wc -l

   # Replace wildcard imports
   # Find: import * as Icons from '@ant-design/icons'
   # Replace: import { UserOutlined, SettingOutlined } from '@ant-design/icons'
   ```

   **Expected Impact:** ↓ 400-450KB

2. **🔄 Move googleapis to Backend**

   ```bash
   # Create backend proxy for Google APIs
   # Remove googleapis from frontend dependencies
   ```

   **Expected Impact:** ↓ 500KB

### 📋 Immediate Actions (< 1 hour)

1. **Optimize Icon Imports**

   ```bash
   # Find all icon imports
   grep -r "@ant-design/icons" src/ --include="*.jsx" --include="*.js"

   # Replace with specific imports
   # Use VSCode Find & Replace or sed
   ```

2. **Enable Compression**

   ```bash
   # Add to vercel.json or backend
   # Vercel does this automatically
   ```

3. **Analyze Current Bundle**

   ```bash
   npm run perf:bundle
   npm run analyze
   ```

### 📅 Short-term (< 1 day)

1. **Component-level Code Splitting**
   - Identify heavy components (charts, editors, modals)
   - Convert to lazy loading
   - Add loading skeletons

   ```javascript
   // Target components:
   // - RichTextEditor
   // - AdvancedChart
   // - DataTable
   // - ImageGallery
   ```

2. **Optimize Lodash Usage**

   ```bash
   # Find lodash imports
   grep -r "from 'lodash'" src/

   # Replace with specific imports or native alternatives
   ```

3. **Dynamic Import Heavy Libraries**

   ```javascript
   // Target libraries:
   // - papaparse (CSV parsing)
   // - jspdf (PDF generation)
   // - xlsx (Excel export)
   ```

### 🗓️ Long-term (< 1 week)

1. **Comprehensive Dependency Audit**

   ```bash
   # Analyze all dependencies
   npx bundlephobia [package-name]

   # Find alternatives
   # - recharts → lightweight chart library?
   # - socket.io-client → native WebSocket?
   ```

2. **Asset Optimization**
   - Convert images to WebP
   - Implement lazy loading for images
   - Optimize fonts (subset, preload)
   - Add service worker for caching

3. **Performance Monitoring**
   - Set up bundle size monitoring in CI/CD
   - Add performance budgets
   - Track metrics over time

4. **Advanced Webpack Configuration**
   - Implement CRACO for custom webpack config
   - Optimize chunk splitting strategy
   - Configure tree shaking for all modules

### 🎯 Expected Results After All Optimizations

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Main Bundle | 675 KB | ~250 KB | ↓ 63% |
| Total JS | 2.38 MB | ~1 MB | ↓ 58% |
| Load Time (4G) | ~4.2s | ~1.8s | ↓ 57% |
| Lighthouse | 65 | 92+ | ↑ 42% |
| FCP | 3.5s | 1.5s | ↓ 57% |
| TTI | 5.5s | 3.0s | ↓ 45% |

---

## 📚 Tools & Resources

### Analysis Tools

#### Built-in Scripts

```bash
# 🎯 Comprehensive bundle analysis (RECOMMENDED)
npm run perf:bundle

# 📊 Visual treemap analysis
npm run analyze

# 🔍 Check unused dependencies
npm run perf:deps
npx depcheck

# 📏 Check size limits
npm run perf:size

# 🗺️ Source map explorer (detailed per-file analysis)
npx source-map-explorer build/static/js/*.js

# 📦 Webpack bundle analyzer
npm run build -- --stats
npx webpack-bundle-analyzer build/bundle-stats.json

# 🔬 Analyze specific chunk
npx source-map-explorer build/static/js/main.*.js
```

#### External Tools

**Package Analysis:**

- [Bundlephobia](https://bundlephobia.com/) - Check package sizes before installing
- [Package Phobia](https://packagephobia.com/) - Alternative package size checker
- [npm trends](https://npmtrends.com/) - Compare packages

**Bundle Analysis:**

- [Bundle Buddy](https://bundle-buddy.com/) - Find duplicate code across chunks
- [Webpack Visualizer](https://chrisbateman.github.io/webpack-visualizer/) - Visual bundle analysis
- [Webpack Chart](https://alexkuz.github.io/webpack-chart/) - Interactive bundle chart

**Performance Testing:**

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [WebPageTest](https://www.webpagetest.org/) - Real-world performance testing
- [GTmetrix](https://gtmetrix.com/) - Performance analysis
- [PageSpeed Insights](https://pagespeed.web.dev/) - Google's performance tool

**Monitoring:**

- [Bundlewatch](https://github.com/bundlewatch/bundlewatch) - CI bundle size monitoring
- [Size Limit](https://github.com/ai/size-limit) - Bundle size limit in CI
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated Lighthouse

### Usage Examples

#### Check Package Size Before Installing

```bash
# Check size of a package
npx bundlephobia antd
npx bundlephobia @ant-design/icons
npx bundlephobia recharts

# Compare alternatives
npx bundlephobia moment vs dayjs
npx bundlephobia lodash vs lodash-es vs ramda

# Check with specific version
npx bundlephobia antd@5.29.1
```

#### Analyze Bundle Composition

```bash
# 1. Build with stats
npm run build -- --stats

# 2. Analyze with webpack-bundle-analyzer
npx webpack-bundle-analyzer build/bundle-stats.json

# 3. Or use source-map-explorer
npx source-map-explorer build/static/js/*.js --html bundle-report.html

# 4. Open report in browser
open bundle-report.html
```

#### Monitor Bundle Size in CI/CD

```bash
# Install bundlewatch
npm install --save-dev bundlewatch

# Add to package.json
{
  "bundlewatch": {
    "files": [
      {
        "path": "build/static/js/main.*.js",
        "maxSize": "300 KB"
      },
      {
        "path": "build/static/js/*.chunk.js",
        "maxSize": "200 KB"
      }
    ]
  }
}

# Run in CI
npx bundlewatch
```

#### Performance Testing

```bash
# Lighthouse CLI
npx lighthouse https://your-app.com --view

# Lighthouse with specific options
npx lighthouse https://your-app.com \
  --only-categories=performance \
  --output=html \
  --output-path=./lighthouse-report.html

# Test on mobile
npx lighthouse https://your-app.com \
  --preset=mobile \
  --view
```

---

## ✅ Optimization Checklist

### 🔍 Analysis Phase

- [x] Run bundle analyzer (`npm run perf:bundle`)
- [x] Identify largest dependencies (antd, googleapis, recharts)
- [x] Check for unused dependencies (`npx depcheck`)
- [x] Analyze chunk sizes
- [ ] Review all imports in codebase
- [ ] Check for duplicate dependencies
- [ ] Identify optimization opportunities

### 🔧 Implementation Phase

#### Code Splitting

- [x] Implement route-based splitting (all routes lazy loaded)
- [ ] Implement component-based splitting (charts, modals, editors)
- [ ] Add loading skeletons for lazy components
- [ ] Implement preloading strategy
- [ ] Test code splitting in production

#### Dependencies

- [x] Replace moment.js with dayjs
- [x] Remove unused dependencies (ajv, lucide-react, etc.)
- [ ] Optimize Ant Design icon imports
- [ ] Move googleapis to backend
- [ ] Optimize lodash usage
- [ ] Replace or lazy load recharts
- [ ] Audit all dependencies with bundlephobia

#### Build Configuration

- [x] Create .env.production
- [x] Disable source maps
- [x] Configure production optimizations
- [ ] Set up CRACO for advanced webpack config
- [ ] Configure chunk splitting strategy
- [ ] Enable compression (gzip/brotli)

#### Assets

- [ ] Optimize images (WebP, compression)
- [ ] Implement lazy loading for images
- [ ] Optimize fonts (subset, preload)
- [ ] Add service worker for caching
- [ ] Configure CDN for static assets

### 🧪 Testing Phase

- [ ] Test build locally (`npm run build && npm run serve:build`)
- [ ] Verify code splitting works correctly
- [ ] Test lazy loading on slow network
- [ ] Check bundle size < 1 MB target
- [ ] Run Lighthouse audit (score > 90)
- [ ] Test on different devices/networks
- [ ] Verify all features work in production build

### 📊 Monitoring Phase

- [ ] Set up bundle size monitoring in CI/CD
- [ ] Configure performance budgets
- [ ] Monitor Core Web Vitals
- [ ] Track bundle size over time
- [ ] Set up alerts for size increases
- [ ] Review performance metrics weekly

### 🚀 Before Deployment

- [ ] Run `npm run perf:bundle`
- [ ] Verify bundle size targets met
- [ ] Check Lighthouse score > 90
- [ ] Test on slow 3G network
- [ ] Verify production build works
- [ ] Review all lazy loaded routes
- [ ] Check for console errors
- [ ] Test critical user flows

### 📈 After Deployment

- [ ] Monitor bundle size in production
- [ ] Check real user metrics (RUM)
- [ ] Review Core Web Vitals
- [ ] Analyze user behavior on slow networks
- [ ] Update optimization targets
- [ ] Document lessons learned
- [ ] Plan next optimization iteration

---

## 🆘 Troubleshooting

### Problem: Bundle Too Large (> 2 MB)

**Symptoms:**

- Slow initial load
- High bandwidth usage
- Poor performance on mobile

**Diagnosis:**

```bash
# 1. Analyze bundle
npm run perf:bundle

# 2. Identify largest chunks
ls -lh build/static/js/*.js | sort -k5 -h -r | head -10

# 3. Check dependencies
npx bundlephobia [package-name]
```

**Solutions:**

1. Implement code splitting for routes and components
2. Replace large dependencies (googleapis → backend, moment → dayjs)
3. Optimize Ant Design imports (specific icons only)
4. Use dynamic imports for heavy libraries
5. Remove unused dependencies

### Problem: Slow Load Time (> 3s)

**Symptoms:**

- Long white screen
- High Time to Interactive (TTI)
- Poor Lighthouse score

**Diagnosis:**

```bash
# 1. Run Lighthouse
npx lighthouse https://your-app.com --view

# 2. Check network waterfall
# Use Chrome DevTools → Network tab

# 3. Analyze load time
npm run build && npm run serve:build
# Open in browser and check Performance tab
```

**Solutions:**

1. Enable compression (gzip/brotli)
2. Use CDN for static assets
3. Implement caching strategy
4. Optimize images (WebP, lazy loading)
5. Reduce main bundle size
6. Add preload/prefetch hints

### Problem: Build Errors

**Symptoms:**

- Build fails with errors
- Webpack compilation errors
- Out of memory errors

**Diagnosis:**

```bash
# Check error messages
npm run build 2>&1 | tee build-error.log

# Check for circular dependencies
npx madge --circular src/

# Check Node.js memory
node --max-old-space-size=4096 node_modules/.bin/react-scripts build
```

**Solutions:**

```bash
# 1. Clear all caches
rm -rf node_modules/.cache
rm -rf build
rm -rf .eslintcache

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Rebuild
npm run build

# 4. If out of memory, increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Problem: Code Splitting Not Working

**Symptoms:**

- All code in main bundle
- No chunk files generated
- Lazy loading not working

**Diagnosis:**

```bash
# Check if chunks are created
ls -la build/static/js/*.chunk.js

# Verify lazy loading syntax
grep -r "React.lazy" src/
```

**Solutions:**

1. Verify React.lazy() syntax is correct
2. Check Suspense boundaries are in place
3. Ensure dynamic imports use correct syntax
4. Check webpack configuration

### Problem: Duplicate Dependencies

**Symptoms:**

- Bundle larger than expected
- Same library bundled multiple times

**Diagnosis:**

```bash
# Find duplicates
npm ls [package-name]

# Check with bundle analyzer
npm run analyze
```

**Solutions:**

```bash
# Deduplicate dependencies
npm dedupe

# Update package-lock.json
rm package-lock.json
npm install

# Use resolutions in package.json
{
  "resolutions": {
    "package-name": "specific-version"
  }
}
```

### Problem: Tree Shaking Not Working

**Symptoms:**

- Unused code still in bundle
- Large bundle despite small usage

**Diagnosis:**

```bash
# Check if code is tree-shakeable
# Look for side effects in package.json

# Analyze what's included
npx source-map-explorer build/static/js/main.*.js
```

**Solutions:**

1. Use named exports instead of default exports
2. Avoid side effects in modules
3. Configure `sideEffects: false` in package.json
4. Use ES modules instead of CommonJS

---

## 📊 Optimization Results

### Current Status (Dec 11, 2025)

**Before Latest Optimizations:**

```
Main Bundle:     850 KB
Total JS:        2.5 MB
Total CSS:       120 KB
Load Time:       4.5s
Lighthouse:      62/100
FCP:            3.8s
TTI:            6.2s
```

**After Initial Optimizations:**

```
Main Bundle:     675 KB  (↓ 21%)
Total JS:        2.38 MB (↓ 5%)
Total CSS:       81 KB   (↓ 33%)
Load Time:       4.2s    (↓ 7%)
Lighthouse:      65/100  (↑ 5%)
FCP:            3.5s    (↓ 8%)
TTI:            5.5s    (↓ 11%)
```

**Target After Full Optimization:**

```
Main Bundle:     250 KB  (↓ 63% from current)
Total JS:        1.0 MB  (↓ 58% from current)
Total CSS:       60 KB   (↓ 26% from current)
Load Time:       1.8s    (↓ 57% from current)
Lighthouse:      92/100  (↑ 42% from current)
FCP:            1.5s    (↓ 57% from current)
TTI:            3.0s    (↓ 45% from current)
```

### Optimization Impact Summary

| Optimization | Size Reduction | Status |
|--------------|----------------|--------|
| Route-based code splitting | ↓ 175 KB | ✅ Done |
| Remove unused dependencies | ↓ 79 packages | ✅ Done |
| Replace moment → dayjs | ↓ 68 KB | ✅ Done |
| Disable source maps | ↓ 40% build | ✅ Done |
| Optimize Ant Design icons | ↓ 400 KB | 🔄 In Progress |
| Move googleapis to backend | ↓ 500 KB | 📋 Planned |
| Component-level splitting | ↓ 200 KB | 📋 Planned |
| Dynamic imports | ↓ 150 KB | 📋 Planned |
| Asset optimization | ↓ 100 KB | 📋 Planned |

---

## 🎯 Next Steps

### Immediate (Today)

1. **Run analysis:**

   ```bash
   npm run perf:bundle
   npm run analyze
   ```

2. **Optimize Ant Design icons:**

   ```bash
   # Find all icon imports
   grep -r "@ant-design/icons" src/

   # Replace with specific imports
   ```

3. **Test current optimizations:**

   ```bash
   npm run build
   npm run serve:build
   # Test in browser
   ```

### This Week

1. Implement component-level code splitting
2. Move googleapis to backend proxy
3. Optimize remaining dependencies
4. Set up performance monitoring

### This Month

1. Comprehensive asset optimization
2. Implement service worker
3. Configure CDN
4. Advanced webpack optimization
5. Performance budget in CI/CD

---

## 📚 Additional Resources

### Documentation

- [React Code Splitting](https://reactjs.org/docs/code-splitting.html)
- [Webpack Bundle Analysis](https://webpack.js.org/guides/code-splitting/)
- [Web.dev Performance](https://web.dev/performance/)
- [Ant Design Tree Shaking](https://ant.design/docs/react/getting-started#Import-on-Demand)

### Tools

- [Bundlephobia](https://bundlephobia.com/)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Source Map Explorer](https://github.com/danvk/source-map-explorer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Articles

- [The Cost of JavaScript](https://v8.dev/blog/cost-of-javascript-2019)
- [Optimizing Bundle Size](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [React Performance Optimization](https://kentcdodds.com/blog/optimize-react-re-renders)

---

## 📞 Support

Nếu gặp vấn đề trong quá trình optimization:

1. Check [Troubleshooting](#-troubleshooting) section
2. Run diagnostic commands
3. Review error logs
4. Check documentation
5. Ask team for help

---

**Last Updated:** December 11, 2025
**Version:** 4.0
**Status:** 🔄 Active Optimization
**Next Review:** December 18, 2025

**Maintained by:** React OAS Team
**Contact:** [Your contact info]
