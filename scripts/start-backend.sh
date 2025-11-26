#!/bin/bash

# 🚀 Script để start backend server
# Fix: "Không thể kết nối đến server"

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
LOG_DIR="$PROJECT_ROOT/logs"

echo -e "${BLUE}🚀 Starting Backend Server...${NC}"
echo "================================================="

# Tạo log directory
mkdir -p "$LOG_DIR"

# Kiểm tra backend directory
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory không tồn tại!${NC}"
    exit 1
fi

cd "$BACKEND_DIR"

# Kiểm tra dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Đang cài đặt backend dependencies...${NC}"
    npm install
fi

# Kiểm tra port 3001
if lsof -ti:3001 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3001 đang được sử dụng. Đang dừng process cũ...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start backend server
echo -e "${BLUE}🔄 Đang start backend server trên port 3001...${NC}"
nohup npm start > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

# Đợi server khởi động
sleep 3

# Kiểm tra xem server đã chạy chưa
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server đã start với PID: $BACKEND_PID${NC}"
    echo -e "${GREEN}📊 Health check: http://localhost:3001/health${NC}"
    echo -e "${GREEN}📝 Logs: $LOG_DIR/backend.log${NC}"

    # Test health endpoint
    sleep 2
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend server đang chạy và phản hồi!${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend đang khởi động, vui lòng đợi thêm vài giây...${NC}"
    fi
else
    echo -e "${RED}❌ Backend server không thể start!${NC}"
    echo -e "${RED}📝 Xem logs: tail -f $LOG_DIR/backend.log${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}💡 Lưu ý:${NC}"
echo "   - Backend đang chạy ở background"
echo "   - Để xem logs: tail -f $LOG_DIR/backend.log"
echo "   - Để dừng: kill $BACKEND_PID"

