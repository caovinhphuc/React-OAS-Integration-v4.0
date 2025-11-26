# 🔧 Port Conflict Resolution Guide

## 📋 Tổng Quan

Hướng dẫn xử lý xung đột port khi chạy development servers.

## 🔍 Kiểm Tra Ports

### Quick Check

```bash
# Kiểm tra trạng thái tất cả ports
npm run check:ports

# Hoặc
bash scripts/check-ports.sh
```

### Manual Check

```bash
# Kiểm tra port cụ thể
lsof -i:3000  # Frontend port
lsof -i:3001  # Backend port
lsof -i:8000  # AI Service port
lsof -i:8001  # Automation port
```

## 🛠️ Xử Lý Port Conflicts

### Option 1: Auto Fix (Recommended)

```bash
# Tự động kill các dev servers đang chạy
npm run fix:ports

# Hoặc
bash scripts/fix-port-conflict.sh
```

Script này sẽ:

- ✅ Tìm các processes đang sử dụng ports 3000, 3001, 8000, 8001
- ✅ Tự động kill các development servers (React, Node, Python)
- ✅ Bỏ qua browser processes (Chrome, Safari, Firefox)
- ✅ Báo cáo trạng thái sau khi cleanup

### Option 2: Kill Specific Port

```bash
# Kill processes trên port cụ thể
npm run kill:port 3000

# Hoặc
bash scripts/kill-port.sh 3000 3001
```

### Option 3: Manual Kill

```bash
# Tìm PID của process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Hoặc kill theo tên
pkill -f "react-scripts start"
pkill -f "node.*server.js"
```

## 📊 Ports Sử Dụng

| Port | Service | Description |
|------|---------|-------------|
| 3000 | Frontend (React) | React development server |
| 3001 | Backend (Node.js) | Express + WebSocket server |
| 8000 | AI Service (Python) | FastAPI service |
| 8001 | Automation (Python) | Automation bridge API |

## 🔄 Workflow Khuyến Nghị

### 1. Trước Khi Start Dev Servers

```bash
# Check ports
npm run check:ports

# Nếu có conflicts, fix chúng
npm run fix:ports

# Verify lại
npm run check:ports
```

### 2. Khi Gặp Port Conflict Error

```
Something is already running on port 3000.
```

**Solution:**

```bash
# Option 1: Auto fix
npm run fix:ports

# Option 2: Manual kill
kill -9 $(lsof -ti:3000)

# Option 3: Change port (trong .env hoặc package.json)
PORT=3002 npm start
```

### 3. Sau Khi Stop Dev Servers

```bash
# Cleanup tất cả ports
npm run fix:ports
```

## 🐛 Troubleshooting

### Problem: Port vẫn bị chiếm sau khi kill

**Solution:**

```bash
# Kill force
kill -9 $(lsof -ti:3000)

# Hoặc đợi vài giây rồi thử lại
sleep 2
npm run check:ports
```

### Problem: Chrome/Browser đang giữ port

**Solution:**

- Đây là bình thường - browser có thể giữ connections
- React dev server sẽ tự động tìm port khác hoặc override
- Nếu cần, đóng browser và mở lại

### Problem: Multiple React apps đang chạy

**Solution:**

```bash
# Kill tất cả React dev servers
pkill -f "react-scripts start"

# Hoặc kill theo port
npm run fix:ports
```

### Problem: Port bị chiếm bởi process không phải dev server

**Solution:**

```bash
# Check process
ps -p $(lsof -ti:3000)

# Nếu không phải dev server, thay đổi port trong .env
echo "PORT=3002" >> .env
```

## 📝 Scripts Available

| Script | Command | Description |
|--------|---------|-------------|
| `check-ports.sh` | `npm run check:ports` | Kiểm tra trạng thái ports |
| `fix-port-conflict.sh` | `npm run fix:ports` | Tự động fix port conflicts |
| `kill-port.sh` | `npm run kill:port` | Kill processes trên ports cụ thể |

## ✅ Best Practices

1. **Luôn check ports trước khi start:**

   ```bash
   npm run check:ports
   ```

2. **Sử dụng fix:ports script:**

   ```bash
   npm run fix:ports
   ```

3. **Cleanup sau khi làm việc:**

   ```bash
   # Stop all servers (Ctrl+C)
   # Then cleanup
   npm run fix:ports
   ```

4. **Sử dụng .env để config ports:**

   ```bash
   # .env
   PORT=3000
   REACT_APP_API_URL=http://localhost:3001
   ```

---

**💡 Tip:** Thêm `npm run check:ports` vào pre-start script trong package.json để tự động check trước khi start servers.
