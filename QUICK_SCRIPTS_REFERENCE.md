# 🚀 Quick Scripts Reference

## 📍 Đảm bảo bạn đang ở đúng directory

```bash
# Kiểm tra directory hiện tại
pwd
# Phải là: /Users/phuccao/Projects/React-OAS-Integration-v3.0/-React-OAS-Integration-v3.0

# Nếu không đúng, chuyển đến đúng directory
cd /Users/phuccao/Projects/React-OAS-Integration-v3.0/-React-OAS-Integration-v3.0
```

## 🔌 WebSocket Scripts

```bash
# Test WebSocket connection
npm run test:websocket

# Check backend server status
npm run check:backend
```

## 🔧 Port Management Scripts

```bash
# Check port status
npm run check:ports

# Fix port conflicts automatically
npm run fix:ports

# Kill processes on specific port(s)
npm run kill:port 3000 3001
```

## 🧪 Test Scripts

```bash
# Test API endpoints
npm run test:api

# Test Automation system
npm run test:automation

# Test Google Sheets
npm run test:google-sheets

# Test all (comprehensive)
npm run test:complete
```

## 🔄 Development Scripts

```bash
# Start all services (Frontend + Backend + AI)
npm run dev

# Start backend only
npm run backend

# Start frontend only
npm start
```

## 📋 All Available Scripts

```bash
# List all npm scripts
npm run

# Or check package.json
cat package.json | grep -A 1 "scripts"
```

## ⚠️ Troubleshooting

### Script not found error

**Problem:** `npm error Missing script: "check:backend"`

**Solutions:**

1. **Check you're in the right directory:**

   ```bash
   pwd
   # Should be: .../-React-OAS-Integration-v3.0

   cd /Users/phuccao/Projects/React-OAS-Integration-v3.0/-React-OAS-Integration-v3.0
   ```

2. **Verify package.json exists:**

   ```bash
   ls -la package.json
   ```

3. **Check scripts in package.json:**

   ```bash
   grep "test:websocket\|check:backend" package.json
   ```

4. **Reload npm cache (if needed):**

   ```bash
   npm cache clean --force
   ```

5. **Reinstall if package.json was modified:**

   ```bash
   # Not necessary, but can help
   npm install
   ```

## 🎯 Quick Commands Cheat Sheet

```bash
# WebSocket
npm run test:websocket       # Test WebSocket
npm run check:backend        # Check backend status

# Ports
npm run check:ports          # Check all ports
npm run fix:ports           # Fix port conflicts

# Tests
npm run test:api            # Test APIs
npm run test:automation     # Test automation
npm run test:complete       # Test all

# Development
npm run dev                 # Start all
npm run backend             # Start backend only
npm start                   # Start frontend only
```

---

**💡 Tip:** Nếu vẫn không thấy scripts, đảm bảo bạn đang ở đúng directory và package.json đã được saved!
