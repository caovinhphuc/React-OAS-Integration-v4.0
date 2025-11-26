# 🔧 Fix Chunk Loading Errors

## ❌ Lỗi Hiện Tại

```
ChunkLoadError: Loading chunk vendors-node_modules_recharts_es6_cartesian_Area_js failed
SyntaxError: Unexpected token '<'
```

## 🔍 Nguyên Nhân

1. **Build cache cũ** - Webpack cache bị lỗi
2. **Import paths không đúng** - Case sensitivity issues
3. **Missing dependencies** - ajv module conflict
4. **Chunk files không được generate đúng**

## ✅ Giải Pháp Đã Áp Dụng

### 1. Fixed Import Paths

- ✅ `./components/Dashboard/LiveDashboard` (uppercase D)
- ✅ `./components/Common/Loading` (uppercase C)
- ✅ `./components/Alerts/AlertsManagement` (uppercase A)

### 2. Fixed Dependencies

- ✅ Cài lại `ajv@8.17.1` để fix dependency conflict
- ✅ Dependencies đã được cài lại với `--legacy-peer-deps`

### 3. Clear Cache

```bash
# Clear all caches
rm -rf build .cache node_modules/.cache .eslintcache
```

## 🛠️ Steps to Fix

### Step 1: Clear Cache

```bash
npm run cleanup:duplicates
rm -rf build .cache node_modules/.cache .eslintcache
```

### Step 2: Reinstall Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 3: Restart Dev Server

```bash
# Kill existing processes
npm run fix:ports

# Start fresh
npm start
```

## 🔄 Alternative: Full Clean Rebuild

```bash
# 1. Clean everything
rm -rf node_modules package-lock.json build .cache

# 2. Reinstall
npm install --legacy-peer-deps

# 3. Start
npm start
```

## 📝 Notes

- Lỗi chunk loading thường xảy ra khi build cache bị corrupt
- Import paths phải match chính xác với folder structure (case-sensitive)
- Recharts chunk error có thể do webpack config issues

## ✅ Verification

Sau khi fix, kiểm tra:

- [ ] No chunk load errors in browser console
- [ ] All components load correctly
- [ ] Charts render properly
- [ ] No "Unexpected token" errors

---

**Status:** ✅ Fixed import paths, cleared cache, reinstalled dependencies
