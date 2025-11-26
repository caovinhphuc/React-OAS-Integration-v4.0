#!/bin/bash

# ================================================
# MIA Warehouse Management - Start All Services
# ================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    print_status "🔄 Killing processes on port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 2
}

print_status "🚀 Starting MIA Warehouse Management System..."
echo "=================================================="

# Check if .env exists
if [[ ! -f .env ]]; then
    print_error "❌ .env file not found!"
    print_status "Please run: cp .env.example .env"
    print_status "Then edit .env with your actual credentials"
    exit 1
fi

# Check frontend port 3000
if check_port 3000; then
    print_warning "⚠️ Port 3000 is already in use"
    read -p "Kill existing process? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill_port 3000
    else
        print_error "❌ Cannot start frontend on port 3000"
        exit 1
    fi
fi

# Check backend port 8000
if check_port 8000; then
    print_warning "⚠️ Port 8000 is already in use"
    read -p "Kill existing process? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill_port 8000
    else
        print_error "❌ Cannot start backend on port 8000"
        exit 1
    fi
fi

# Check if virtual environment exists
if [[ ! -d "venv" ]]; then
    print_error "❌ Virtual environment not found!"
    print_status "Please run: ./install.sh"
    exit 1
fi

# Check if node_modules exists
if [[ ! -d "node_modules" ]]; then
    print_error "❌ Node modules not found!"
    print_status "Please run: npm install"
    exit 1
fi

print_success "✅ Pre-checks passed"
echo ""

# Create log files
mkdir -p logs
touch logs/frontend.log logs/backend.log

print_status "🎯 Starting services..."

# Start backend in background
print_status "🐍 Starting backend API server..."
(
    source venv/bin/activate
    python automation_bridge.py > logs/backend.log 2>&1
) &
BACKEND_PID=$!
echo $BACKEND_PID > .backend.pid

# Wait for backend to start
print_status "⏳ Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        print_success "✅ Backend started on http://localhost:8000"
        break
    fi
    if [[ $i -eq 30 ]]; then
        print_error "❌ Backend failed to start after 30 seconds"
        print_status "Check logs/backend.log for details"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# Start frontend in background
print_status "⚛️ Starting frontend development server..."
(
    npm start > logs/frontend.log 2>&1
) &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend.pid

# Wait for frontend to start
print_status "⏳ Waiting for frontend to start..."
for i in {1..60}; do
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        print_success "✅ Frontend started on http://localhost:3000"
        break
    fi
    if [[ $i -eq 60 ]]; then
        print_error "❌ Frontend failed to start after 60 seconds"
        print_status "Check logs/frontend.log for details"
        kill $FRONTEND_PID 2>/dev/null || true
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

echo ""
echo "=================================================="
print_success "🎉 All services started successfully!"
echo ""
print_status "📋 Service URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo "   Health:    http://localhost:8000/health"
echo ""
print_status "📊 Monitoring:"
echo "   Frontend logs: tail -f logs/frontend.log"
echo "   Backend logs:  tail -f logs/backend.log"
echo ""
print_status "🛑 To stop services:"
echo "   ./stop_all.sh"
echo "   Or press Ctrl+C"
echo ""
print_status "🌐 Opening browser..."
sleep 3

# Open browser (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
# Open browser (Linux)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 >/dev/null 2>&1 &
fi

echo "=================================================="
print_status "✨ Ready for warehouse management!"
print_warning "💡 Keep this terminal open to monitor services"
print_status "📞 Support: warehouse@mia.vn"

# Wait for Ctrl+C
trap cleanup SIGINT

cleanup() {
    echo ""
    print_status "🛑 Shutting down services..."
    
    if [[ -f .frontend.pid ]]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm .frontend.pid
        print_success "✅ Frontend stopped"
    fi
    
    if [[ -f .backend.pid ]]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm .backend.pid
        print_success "✅ Backend stopped"
    fi
    
    # Clean up any remaining processes
    kill_port 3000
    kill_port 8000
    
    print_success "🎯 All services stopped"
    exit 0
}

# Keep script running
while true; do
    sleep 1
done