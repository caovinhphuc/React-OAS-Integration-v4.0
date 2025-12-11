#!/bin/bash

# =============================================================================
# Update Vercel Environment Variables - React OAS Integration v4.0
# =============================================================================

set -e

# Colors
readonly GREEN='\033[0;32m'
readonly BLUE='\033[0;34m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

# Configuration - Load from .env if exists
if [ -f "../.env" ]; then
    source ../.env
fi

# Environment variables to update
REACT_APP_API_URL=${REACT_APP_API_URL:-"http://localhost:3001"}
REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL:-"http://localhost:3001/api"}
REACT_APP_AI_SERVICE_URL=${REACT_APP_AI_SERVICE_URL:-"http://localhost:8000"}
GOOGLE_SHEETS_ID=${GOOGLE_SHEETS_ID:-"1TFNZPLY89E0gFJAdmgLLKY-IIfV35TJPzNTPthCgchA"}
GOOGLE_DRIVE_FOLDER_ID=${GOOGLE_DRIVE_FOLDER_ID:-"1dYpDBXzwNnLitUcbh8n3k7OceS62a1JV"}

# Project configuration
PROJECT_NAME=${1:-"react-oas-integration"}
ENVIRONMENT=${2:-"production"}

# Banner
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        🚀 Update Vercel Environment Variables              ║${NC}"
echo -e "${CYAN}║           React OAS Integration v4.0                       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Show current configuration
echo -e "${YELLOW}📋 Environment Variables to Update:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Project:${NC} $PROJECT_NAME"
echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo ""
echo -e "${BLUE}Variables:${NC}"
echo "  • REACT_APP_API_URL = $REACT_APP_API_URL"
echo "  • REACT_APP_API_BASE_URL = $REACT_APP_API_BASE_URL"
echo "  • REACT_APP_AI_SERVICE_URL = $REACT_APP_AI_SERVICE_URL"
echo "  • GOOGLE_SHEETS_ID = $GOOGLE_SHEETS_ID"
echo "  • GOOGLE_DRIVE_FOLDER_ID = $GOOGLE_DRIVE_FOLDER_ID"
echo ""

# Function to update single env var
update_env_var() {
    local var_name=$1
    local var_value=$2
    local env_type=$3

    echo -e "${BLUE}Updating $var_name...${NC}"

    # Remove existing variable if exists
    vercel env rm "$var_name" "$env_type" -y 2>/dev/null || true

    # Add new value
    echo "$var_value" | vercel env add "$var_name" "$env_type" --force

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $var_name updated${NC}"
    else
        echo -e "${RED}❌ Failed to update $var_name${NC}"
        return 1
    fi
}

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not installed${NC}"
    echo ""
    echo -e "${YELLOW}📦 Install Vercel CLI:${NC}"
    echo "   npm install -g vercel"
    echo ""
    echo -e "${YELLOW}🌐 Or update manually via Web Dashboard:${NC}"
    echo "   1. Go to: https://vercel.com/dashboard"
    echo "   2. Select your project"
    echo "   3. Go to Settings > Environment Variables"
    echo "   4. Update the variables listed above"
    echo "   5. Redeploy your application"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI is installed${NC}"
echo ""

# Confirm before proceeding
read -p "Do you want to update environment variables now? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}👍 Update cancelled${NC}"
    echo ""
    echo -e "${BLUE}💡 To update manually:${NC}"
    echo "   1. Go to: https://vercel.com/dashboard"
    echo "   2. Select project: $PROJECT_NAME"
    echo "   3. Settings > Environment Variables"
    echo "   4. Update the variables"
    exit 0
fi

echo ""
echo -e "${CYAN}🔧 Updating environment variables...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Update each variable
update_env_var "REACT_APP_API_URL" "$REACT_APP_API_URL" "$ENVIRONMENT"
update_env_var "REACT_APP_API_BASE_URL" "$REACT_APP_API_BASE_URL" "$ENVIRONMENT"
update_env_var "REACT_APP_AI_SERVICE_URL" "$REACT_APP_AI_SERVICE_URL" "$ENVIRONMENT"
update_env_var "GOOGLE_SHEETS_ID" "$GOOGLE_SHEETS_ID" "$ENVIRONMENT"
update_env_var "GOOGLE_DRIVE_FOLDER_ID" "$GOOGLE_DRIVE_FOLDER_ID" "$ENVIRONMENT"

echo ""
echo -e "${GREEN}✅ All environment variables updated!${NC}"
echo ""

# Ask about redeployment
read -p "Do you want to trigger a redeploy now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${CYAN}🚀 Triggering redeploy...${NC}"
    vercel --prod

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Deployment triggered successfully!${NC}"
    else
        echo ""
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Remember to redeploy manually:${NC}"
    echo "   vercel --prod"
    echo ""
    echo "   Or via dashboard:"
    echo "   https://vercel.com/dashboard → Deployments → Redeploy"
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎯 Next Steps:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. ✅ Environment variables updated in Vercel"
echo "2. 🔄 Redeploy application (if not done above)"
echo "3. 🧪 Test application functionality"
echo "4. 🔒 Configure API restrictions (recommended)"
echo "5. 📊 Monitor application logs"
echo ""
echo -e "${BLUE}📚 Useful Commands:${NC}"
echo "   vercel env ls                    # List all env vars"
echo "   vercel env pull                  # Pull env vars to local"
echo "   vercel logs                      # View deployment logs"
echo "   vercel --prod                    # Deploy to production"
echo ""
echo -e "${BLUE}🌐 Dashboard:${NC}"
echo "   https://vercel.com/dashboard"
echo ""
echo -e "${GREEN}✨ Update completed! ✨${NC}"
echo ""

