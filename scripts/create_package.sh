#!/bin/bash

# ================================================
# MIA Warehouse Management - Package Creator
# Creates distribution ZIP file
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

PACKAGE_NAME="mia-warehouse-management-v1.0.0"
PACKAGE_DIR="../${PACKAGE_NAME}"
ZIP_FILE="../${PACKAGE_NAME}.zip"

print_status "📦 Creating distribution package..."
echo "=================================================="

# Create package directory
print_status "📁 Creating package directory..."
rm -rf "$PACKAGE_DIR" 2>/dev/null || true
mkdir -p "$PACKAGE_DIR"

# Copy essential files
print_status "📋 Copying project files..."

# Core application files
cp -r src/ "$PACKAGE_DIR/"
cp -r public/ "$PACKAGE_DIR/"
cp -r docs/ "$PACKAGE_DIR/"
cp -r config/ "$PACKAGE_DIR/"
cp -r scripts/ "$PACKAGE_DIR/"

# Python files
cp automation.py "$PACKAGE_DIR/"
cp automation_bridge.py "$PACKAGE_DIR/"
cp test_webdriver.py "$PACKAGE_DIR/"

# Configuration files
cp package.json "$PACKAGE_DIR/"
cp requirements*.txt "$PACKAGE_DIR/"
cp setup.py "$PACKAGE_DIR/"
cp pyproject.toml "$PACKAGE_DIR/"
cp tailwind.config.js "$PACKAGE_DIR/"
cp postcss.config.js "$PACKAGE_DIR/"
cp vercel.json "$PACKAGE_DIR/"
cp .env.example "$PACKAGE_DIR/"

# Documentation
cp README_PACKAGE.md "$PACKAGE_DIR/README.md"
cp QUICK_START.md "$PACKAGE_DIR/"
cp INSTALLATION.md "$PACKAGE_DIR/"
cp PROJECT_STRUCTURE.md "$PACKAGE_DIR/"
cp TROUBLESHOOTING.md "$PACKAGE_DIR/"
cp DEPENDENCIES.md "$PACKAGE_DIR/"

# Scripts
cp *.sh "$PACKAGE_DIR/" 2>/dev/null || true
cp *.bat "$PACKAGE_DIR/" 2>/dev/null || true

# Create empty directories
mkdir -p "$PACKAGE_DIR/logs"
mkdir -p "$PACKAGE_DIR/data/exports"
mkdir -p "$PACKAGE_DIR/data/imports"
mkdir -p "$PACKAGE_DIR/backup"

# Create README files for empty directories
echo "# Logs Directory
This directory will contain application logs.
- automation_YYYYMMDD.log - Automation logs
- api_YYYYMMDD.log - API server logs
- error_YYYYMMDD.log - Error logs" > "$PACKAGE_DIR/logs/README.md"

echo "# Data Directory
This directory will contain data exports and imports.
- exports/ - Generated reports and exports
- imports/ - Data to be imported" > "$PACKAGE_DIR/data/README.md"

echo "# Backup Directory
This directory will contain backup files." > "$PACKAGE_DIR/backup/README.md"

# Copy sample data (if exists)
if [[ -d data/ ]]; then
    cp -r data/*.csv "$PACKAGE_DIR/data/" 2>/dev/null || true
    cp -r data/*.xlsx "$PACKAGE_DIR/data/" 2>/dev/null || true
fi

# Create package info file
cat > "$PACKAGE_DIR/PACKAGE_INFO.md" << EOF
# 📦 MIA Warehouse Management Package

**Version:** 1.0.0  
**Created:** $(date)  
**Package Type:** Complete Distribution  

## 📋 Package Contents

### 🎯 Core Files
- Frontend React application (src/)
- Backend Python automation (automation.py, automation_bridge.py)
- Configuration files (package.json, requirements.txt)
- Documentation (README.md, guides/)

### 🛠️ Installation Scripts
- install.sh / install.bat - Automated installation
- start_all.sh - Start all services
- stop_all.sh - Stop all services
- update.sh - Update system

### 📚 Documentation
- README.md - Main documentation
- QUICK_START.md - Quick start guide
- INSTALLATION.md - Detailed installation
- PROJECT_STRUCTURE.md - Project structure
- TROUBLESHOOTING.md - Problem solving
- DEPENDENCIES.md - Package management

### 🗂️ Directories
- src/ - Frontend source code
- docs/ - Complete documentation
- config/ - Configuration files
- logs/ - Application logs (empty)
- data/ - Data exports (empty)
- backup/ - Backup files (empty)

## 🚀 Quick Start

1. Extract this package
2. Run: ./install.sh (macOS/Linux) or install.bat (Windows)
3. Edit .env file with your credentials
4. Run: ./start_all.sh
5. Open: http://localhost:3000

## 📞 Support

Email: warehouse@mia.vn  
Docs: See README.md for complete documentation  

**Ready to go! 🎉**
EOF

# Create version file
cat > "$PACKAGE_DIR/VERSION" << EOF
MIA Warehouse Management System
Version: 1.0.0
Build Date: $(date)
Package Type: Complete Distribution
Node.js: $(node --version 2>/dev/null || echo "Not detected")
Python: $(python3 --version 2>/dev/null || echo "Not detected")
EOF

# Make scripts executable
chmod +x "$PACKAGE_DIR"/*.sh 2>/dev/null || true

print_success "✅ Files copied to package directory"

# Create ZIP file
print_status "🗜️ Creating ZIP archive..."
cd "$(dirname "$PACKAGE_DIR")"
rm -f "$ZIP_FILE" 2>/dev/null || true

if command -v zip >/dev/null 2>&1; then
    zip -r "$ZIP_FILE" "$(basename "$PACKAGE_DIR")" -x "*.DS_Store" "*.__pycache__*" "*.pyc"
else
    # Fallback to tar
    tar -czf "${ZIP_FILE}.tar.gz" "$(basename "$PACKAGE_DIR")" --exclude="*.DS_Store" --exclude="*__pycache__*" --exclude="*.pyc"
    print_warning "⚠️ ZIP not available, created .tar.gz instead"
fi

# Calculate package size
if [[ -f "$ZIP_FILE" ]]; then
    PACKAGE_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
    print_success "✅ Package created: $ZIP_FILE ($PACKAGE_SIZE)"
elif [[ -f "${ZIP_FILE}.tar.gz" ]]; then
    PACKAGE_SIZE=$(du -h "${ZIP_FILE}.tar.gz" | cut -f1)
    print_success "✅ Package created: ${ZIP_FILE}.tar.gz ($PACKAGE_SIZE)"
fi

# Generate package summary
echo ""
echo "=================================================="
print_success "🎉 Package creation completed!"
echo ""
print_status "📊 Package Summary:"
echo "   Name: $PACKAGE_NAME"
echo "   Size: $PACKAGE_SIZE"
echo "   Files: $(find "$PACKAGE_DIR" -type f | wc -l | tr -d ' ')"
echo "   Location: $(pwd)/$ZIP_FILE"
echo ""
print_status "📋 Package Contents:"
echo "   ✅ Complete source code"
echo "   ✅ Installation scripts"
echo "   ✅ Documentation"
echo "   ✅ Configuration templates"
echo "   ✅ Empty log/data directories"
echo ""
print_status "🚀 Distribution Ready:"
echo "   1. Share $ZIP_FILE with users"
echo "   2. Users extract and run install.sh"
echo "   3. Ready to use warehouse management system"
echo ""
print_status "📞 Support: warehouse@mia.vn"
echo "=================================================="

# Clean up temporary directory
read -p "Remove temporary package directory? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$PACKAGE_DIR"
    print_success "✅ Temporary directory cleaned up"
fi

print_success "🎯 Distribution package ready for deployment!"