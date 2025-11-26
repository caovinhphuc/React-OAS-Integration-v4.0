#!/bin/bash
# Fix chunk loading errors by clearing cache and rebuilding

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Fixing Chunk Loading Errors${NC}"
echo "=================================="
echo ""

# Step 1: Clear all caches
echo -e "${YELLOW}Step 1: Clearing caches...${NC}"
rm -rf build .cache node_modules/.cache .eslintcache 2>/dev/null
echo -e "${GREEN}✅ Cache cleared${NC}"
echo ""

# Step 2: Fix ajv dependency if needed
echo -e "${YELLOW}Step 2: Checking dependencies...${NC}"
if ! npm list ajv@8.17.1 > /dev/null 2>&1; then
  echo -e "${YELLOW}Installing ajv@8.17.1...${NC}"
  npm install ajv@8.17.1 --legacy-peer-deps --save-dev --silent
fi
echo -e "${GREEN}✅ Dependencies OK${NC}"
echo ""

# Step 3: Verify import paths
echo -e "${YELLOW}Step 3: Verifying import paths...${NC}"
CHECKED=0
FAILED=0

check_file() {
  if [ -f "$1" ]; then
    echo -e "  ${GREEN}✅${NC} $1"
    ((CHECKED++))
  else
    echo -e "  ${RED}❌${NC} $1 (MISSING)"
    ((FAILED++))
  fi
}

check_file "src/components/Dashboard/LiveDashboard.jsx"
check_file "src/components/Common/Loading.jsx"
check_file "src/components/Alerts/AlertsManagement.jsx"
check_file "src/global.css"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All files exist${NC}"
else
  echo -e "${RED}❌ Some files are missing${NC}"
fi
echo ""

# Step 4: Instructions
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Restart dev server: ${BLUE}npm start${NC}"
echo "  2. Or rebuild: ${BLUE}npm run build${NC}"
echo ""
echo -e "${YELLOW}If errors persist:${NC}"
echo "  1. Clear browser cache (Ctrl+Shift+Delete)"
echo "  2. Hard refresh (Ctrl+Shift+R)"
echo "  3. Restart dev server"
echo ""

