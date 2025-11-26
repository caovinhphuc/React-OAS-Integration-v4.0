#!/bin/bash

echo "🚀 Updating Vercel Environment Variables with new API Key..."
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API Key mới
NEW_API_KEY="AIzaSyB_MwjhFxQtxnihpZTa95XH0BCI9MXihh8"
SHEET_ID="1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg"

echo -e "${YELLOW}📋 Environment Variables to Update:${NC}"
echo "REACT_APP_GOOGLE_SHEETS_API_KEY = $NEW_API_KEY"
echo "REACT_APP_GOOGLE_SHEETS_ID = $SHEET_ID"
echo ""

echo -e "${YELLOW}🔧 Method 1: Using Vercel CLI (if installed)${NC}"
echo "vercel env add REACT_APP_GOOGLE_SHEETS_API_KEY production"
echo "# When prompted, enter: $NEW_API_KEY"
echo ""
echo "vercel env add REACT_APP_GOOGLE_SHEETS_ID production"
echo "# When prompted, enter: $SHEET_ID"
echo ""

echo -e "${YELLOW}🌐 Method 2: Using Vercel Web Dashboard (Recommended)${NC}"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select project: warehouse-management-template-jsx"
echo "3. Go to Settings > Environment Variables"
echo "4. Find REACT_APP_GOOGLE_SHEETS_API_KEY and click Edit"
echo "5. Update value to: $NEW_API_KEY"
echo "6. Apply to: Production, Preview, Development"
echo "7. Save changes"
echo "8. Go to Deployments tab and click 'Redeploy' on latest deployment"
echo ""

echo -e "${GREEN}✅ After updating, test at:${NC}"
echo "🌐 https://warehouse-management-template-jsx.vercel.app"
echo ""
echo -e "${GREEN}🔑 Test Login Credentials:${NC}"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Username: manager"
echo "Password: manager123"
echo ""

# Check if vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI is installed!${NC}"
    echo "You can use Method 1 (CLI) or Method 2 (Web Dashboard)"
    echo ""
    read -p "Do you want to update via CLI now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔧 Updating REACT_APP_GOOGLE_SHEETS_API_KEY..."
        echo "$NEW_API_KEY" | vercel env add REACT_APP_GOOGLE_SHEETS_API_KEY production

        echo "🔧 Updating REACT_APP_GOOGLE_SHEETS_ID..."
        echo "$SHEET_ID" | vercel env add REACT_APP_GOOGLE_SHEETS_ID production

        echo -e "${GREEN}✅ Environment variables updated!${NC}"
        echo "🚀 Triggering redeploy..."
        vercel --prod
    else
        echo "👍 Please update manually via Web Dashboard"
    fi
else
    echo -e "${RED}⚠️  Vercel CLI not installed${NC}"
    echo "Please use Method 2 (Web Dashboard) to update environment variables"
    echo ""
    echo "To install Vercel CLI:"
    echo "npm install -g vercel"
fi

echo ""
echo -e "${GREEN}🎯 Next Steps After Update:${NC}"
echo "1. ✅ API Key updated in Vercel"
echo "2. 🔄 Redeploy application"
echo "3. 🧪 Test login functionality"
echo "4. 🔒 Configure API Key restrictions (optional but recommended)"
echo "5. 📊 Test all warehouse management features"
echo ""
echo "=================================================="
echo -e "${GREEN}✨ Ready for production! ✨${NC}"
