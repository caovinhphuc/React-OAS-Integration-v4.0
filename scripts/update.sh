#!/bin/bash

# ================================================
# MIA Warehouse Management - Update Script
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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "🔄 Updating MIA Warehouse Management System..."

# Check if git repository
if [[ -d .git ]]; then
    print_status "📥 Pulling latest changes from repository..."
    if git pull origin main; then
        print_success "✅ Code updated from repository"
    else
        print_warning "⚠️ Failed to update from repository"
    fi
else
    print_warning "⚠️ Not a git repository - skipping code update"
fi

# Update frontend dependencies
print_status "📦 Updating frontend dependencies..."
if npm update; then
    print_success "✅ Frontend dependencies updated"
else
    print_error "❌ Failed to update frontend dependencies"
    exit 1
fi

# Update backend dependencies
if [[ -d venv ]]; then
    print_status "🐍 Updating Python dependencies..."
    if source venv/bin/activate && pip install -r requirements.txt --upgrade; then
        print_success "✅ Python dependencies updated"
    else
        print_error "❌ Failed to update Python dependencies"
        exit 1
    fi
else
    print_warning "⚠️ Virtual environment not found - run ./install.sh first"
fi

# Update ChromeDriver (macOS with Homebrew)
if [[ "$OSTYPE" == "darwin"* ]] && command -v brew >/dev/null 2>&1; then
    print_status "🚗 Updating ChromeDriver..."
    if brew upgrade chromedriver 2>/dev/null; then
        print_success "✅ ChromeDriver updated"
    else
        print_warning "⚠️ ChromeDriver already up to date"
    fi
fi

# Rebuild frontend
print_status "🔧 Rebuilding frontend..."
if npm run build; then
    print_success "✅ Frontend rebuilt"
else
    print_warning "⚠️ Frontend build failed"
fi

print_success "🎉 Update completed successfully!"
print_status "🚀 You can now restart the application with ./start_all.sh"