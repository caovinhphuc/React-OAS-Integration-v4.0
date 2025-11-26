#!/bin/bash

# ================================================
# MIA Warehouse Management - Stop All Services
# ================================================

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

# Function to kill process on port
kill_port() {
    local port=$1
    print_status "🔄 Stopping processes on port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 1
}

print_status "🛑 Stopping MIA Warehouse Management System..."

# Stop services from PID files
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

# Kill any remaining processes on ports
kill_port 3000
kill_port 8000

print_success "🎯 All services stopped successfully!"