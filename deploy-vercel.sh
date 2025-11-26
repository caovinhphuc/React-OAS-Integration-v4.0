#!/bin/bash

# =============================================================================
# 🚀 Vercel Deployment Script - React OAS Integration v4.0
# AI-Powered Analytics Platform
# =============================================================================

set -euo pipefail

# =============================================================================
# Configuration
# =============================================================================
readonly PROJECT_NAME="React OAS Integration v4.0"
readonly PROJECT_VERSION="4.0.0"
readonly GITHUB_REPO="caovinhphuc/React-OAS-Integration-v4.0"
readonly GITHUB_URL="https://github.com/${GITHUB_REPO}"
readonly VERCEL_PROJECT_NAME="react-oas-integration-v4"

# Colors
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly RED='\033[0;31m'
readonly CYAN='\033[0;36m'
readonly PURPLE='\033[0;35m'
readonly NC='\033[0m'

# Flags
FORCE_BUILD=false
SKIP_TESTS=false
PREVIEW_MODE=false
PRODUCTION_MODE=false
AUTO_COMMIT=false

# =============================================================================
# Logging Functions
# =============================================================================
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo -e "${CYAN}[SUCCESS]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# =============================================================================
# Banner
# =============================================================================
show_banner() {
    echo -e "${PURPLE}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║                  🚀 REACT OAS INTEGRATION v4.0                    ║
║              AI-Powered Analytics Platform                        ║
║                  Vercel Deployment Script                         ║
╚══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo -e "${CYAN}Project:${NC} ${PROJECT_NAME}"
    echo -e "${CYAN}Version:${NC} ${PROJECT_VERSION}"
    echo -e "${CYAN}Repository:${NC} ${GITHUB_URL}"
    echo ""
}

# =============================================================================
# Helper Functions
# =============================================================================
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 not found. Please install it first."
        return 1
    fi
    return 0
}

check_file() {
    if [[ ! -f "$1" ]]; then
        log_error "File not found: $1"
        return 1
    fi
    return 0
}

# =============================================================================
# Prerequisites Check
# =============================================================================
check_prerequisites() {
    log_step "Checking prerequisites..."

    # Check Node.js
    if ! check_command node; then
        exit 1
    fi
    local node_version=$(node --version | cut -d'v' -f2)
    log_info "✅ Node.js $node_version found"

    # Check npm
    if ! check_command npm; then
        exit 1
    fi
    local npm_version=$(npm --version)
    log_info "✅ npm $npm_version found"

    # Check Git
    if ! check_command git; then
        log_warn "Git not found. Some features may not work."
    else
        log_info "✅ Git found"
    fi

    # Check Vercel CLI
    VERCEL_CLI_AVAILABLE=false
    if check_command vercel; then
        local vercel_version=$(vercel --version)
        log_info "✅ Vercel CLI $vercel_version found"
        VERCEL_CLI_AVAILABLE=true
    else
        log_warn "Vercel CLI not found. Will install it."
    fi

    # Check package.json
    if ! check_file "package.json"; then
        exit 1
    fi
    log_info "✅ package.json found"

    # Check vercel.json
    if ! check_file "vercel.json"; then
        log_warn "vercel.json not found. Creating default config..."
        create_vercel_config
    else
        log_info "✅ vercel.json found"
    fi

    log_success "Prerequisites check completed"
}

# =============================================================================
# Create Vercel Config
# =============================================================================
create_vercel_config() {
    cat > vercel.json << 'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
EOF
    log_info "Created default vercel.json"
}

# =============================================================================
# Get Vercel Command Path
# =============================================================================
get_vercel_path() {
    # Try to find vercel in PATH first
    if command -v vercel &> /dev/null; then
        echo "vercel"
        return 0
    fi

    # Get npm global bin path
    local npm_global_bin=$(npm config get prefix 2>/dev/null)
    if [[ -n "$npm_global_bin" && "$npm_global_bin" != "undefined" ]]; then
        local vercel_path="${npm_global_bin}/bin/vercel"
        if [[ -f "$vercel_path" ]]; then
            echo "$vercel_path"
            return 0
        fi
    fi

    # Check common locations
    local common_paths=(
        "$HOME/.npm-global/bin/vercel"
        "/usr/local/bin/vercel"
        "$HOME/.local/bin/vercel"
    )

    for path in "${common_paths[@]}"; do
        if [[ -f "$path" ]]; then
            echo "$path"
            return 0
        fi
    done

    return 1
}

# =============================================================================
# Install Vercel CLI
# =============================================================================
install_vercel_cli() {
    if [[ "$VERCEL_CLI_AVAILABLE" == "false" ]]; then
        log_step "Installing Vercel CLI..."
        npm install -g vercel || {
            log_error "Failed to install Vercel CLI"
            exit 1
        }
        log_success "Vercel CLI installed successfully"

        # Refresh PATH to include npm global bin
        local npm_global_bin=$(npm config get prefix 2>/dev/null)
        if [[ -n "$npm_global_bin" && "$npm_global_bin" != "undefined" ]]; then
            export PATH="${npm_global_bin}/bin:$PATH"
        fi

        # Refresh command hash (bash/zsh)
        if command -v hash &> /dev/null; then
            hash -r 2>/dev/null || true
        fi

        # Verify installation
        VERCEL_CMD=$(get_vercel_path)
        if [[ -z "$VERCEL_CMD" ]]; then
            log_error "Vercel CLI installed but not found in PATH"
            log_info "Please add npm global bin to your PATH:"
            log_info "  export PATH=\$(npm config get prefix)/bin:\$PATH"
            exit 1
        fi

        log_info "✅ Vercel CLI found at: $VERCEL_CMD"
        VERCEL_CLI_AVAILABLE=true
    fi
}

# =============================================================================
# Check Vercel Login
# =============================================================================
check_vercel_login() {
    log_step "Checking Vercel authentication..."

    # Get vercel command path
    if [[ -z "${VERCEL_CMD:-}" ]]; then
        VERCEL_CMD=$(get_vercel_path)
        if [[ -z "$VERCEL_CMD" ]]; then
            log_error "Vercel CLI not found. Please install it first."
            exit 1
        fi
    fi

    if ! "$VERCEL_CMD" whoami &> /dev/null; then
        log_warn "Not logged in to Vercel"
        log_info "Please login to Vercel..."
        "$VERCEL_CMD" login || {
            log_error "Failed to login to Vercel"
            exit 1
        }
    else
        local username=$("$VERCEL_CMD" whoami 2>/dev/null || echo "unknown")
        log_info "✅ Logged in as: $username"
    fi
}

# =============================================================================
# Check Git Status
# =============================================================================
check_git_status() {
    if ! check_command git; then
        return 0
    fi

    log_step "Checking Git status..."

    # Check if git repo
    if [[ ! -d ".git" ]]; then
        log_warn "Not a Git repository"
        return 0
    fi

    # Check for uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        log_warn "You have uncommitted changes"

        if [[ "$AUTO_COMMIT" == "true" ]]; then
            log_info "Auto-committing changes..."
            git add .
            git commit -m "chore: prepare for deployment [$(date +'%Y-%m-%d %H:%M:%S')]" || {
                log_warn "Failed to commit changes"
            }
        else
            echo ""
            read -p "Do you want to commit changes before deploying? (y/n): " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                log_info "Staging changes..."
                git add .
                read -p "Commit message (default: 'chore: prepare for deployment'): " commit_msg
                commit_msg=${commit_msg:-"chore: prepare for deployment"}
                git commit -m "$commit_msg" || {
                    log_warn "Failed to commit changes"
                }
            fi
        fi
    else
        log_info "✅ Git working directory is clean"
    fi

    # Check current branch
    local current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    log_info "Current branch: $current_branch"
}

# =============================================================================
# Run Pre-deploy Tests
# =============================================================================
run_pre_deploy_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        log_warn "Skipping pre-deploy tests"
        return 0
    fi

    log_step "Running pre-deploy tests..."

    # Check if test script exists
    if grep -q '"test"' package.json; then
        log_info "Running npm test..."
        npm test -- --watchAll=false --passWithNoTests || {
            log_warn "Some tests failed, but continuing..."
        }
    else
        log_info "No test script found in package.json"
    fi

    log_success "Pre-deploy tests completed"
}

# =============================================================================
# Build Application
# =============================================================================
build_application() {
    log_step "Building application for production..."

    # Clean previous build if force build
    if [[ "$FORCE_BUILD" == "true" && -d "build" ]]; then
        log_info "Cleaning previous build..."
        rm -rf build
    fi

    # Check if build already exists
    if [[ -d "build" && "$FORCE_BUILD" == "false" ]]; then
        log_info "Build folder exists. Skipping build..."
        log_warn "Use --force-build to rebuild"
        return 0
    fi

    # Install dependencies
    log_info "Installing dependencies..."
    npm ci --legacy-peer-deps || {
        log_warn "npm ci failed, trying npm install..."
        npm install --legacy-peer-deps
    }

    # Build for production
    log_info "Building for production..."
    npm run build || {
        log_error "Build failed!"
        exit 1
    }

    # Check build result
    if [[ ! -d "build" ]]; then
        log_error "Build folder not created!"
        exit 1
    fi

    # Check build size
    local build_size=$(du -sh build 2>/dev/null | cut -f1 || echo "unknown")
    log_success "Build completed successfully (Size: $build_size)"

    # Validate build files
    validate_build
}

# =============================================================================
# Validate Build
# =============================================================================
validate_build() {
    log_step "Validating build..."

    local required_files=("index.html" "asset-manifest.json")
    local missing_files=()

    for file in "${required_files[@]}"; do
        if [[ ! -f "build/$file" ]]; then
            missing_files+=("$file")
        fi
    done

    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "Missing required build files: ${missing_files[*]}"
        exit 1
    fi

    log_info "✅ All required build files found"
    log_success "Build validation passed"
}

# =============================================================================
# Check Environment Variables
# =============================================================================
check_environment_variables() {
    log_step "Checking environment variables..."

    # Check if .env file exists
    if [[ -f ".env" || -f ".env.local" ]]; then
        log_info "Environment file found"
    else
        log_warn "No .env file found"
    fi

    # Show required variables
    echo ""
    echo -e "${YELLOW}📝 Required Environment Variables (set in Vercel Dashboard):${NC}"
    echo ""
    echo -e "${BLUE}Required:${NC}"
    echo "  • REACT_APP_API_URL"
    echo "  • REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID (if using Google Sheets)"
    echo ""
    echo -e "${BLUE}Optional:${NC}"
    echo "  • REACT_APP_LANGUAGE=vi"
    echo "  • REACT_APP_TIMEZONE=Asia/Ho_Chi_Minh"
    echo "  • REACT_APP_ENABLE_ANALYTICS=true"
    echo ""
    echo -e "${YELLOW}Configure in Vercel Dashboard → Settings → Environment Variables${NC}"
    echo ""
}

# =============================================================================
# Deploy to Vercel
# =============================================================================
deploy_to_vercel() {
    log_step "Deploying to Vercel..."

    # Get vercel command path
    if [[ -z "${VERCEL_CMD:-}" ]]; then
        VERCEL_CMD=$(get_vercel_path)
        if [[ -z "$VERCEL_CMD" ]]; then
            log_error "Vercel CLI not found. Please install it first."
            exit 1
        fi
    fi

    local deploy_command="$VERCEL_CMD"

    if [[ "$PRODUCTION_MODE" == "true" ]]; then
        log_info "Deploying to PRODUCTION..."
        deploy_command="$VERCEL_CMD --prod --yes"
    elif [[ "$PREVIEW_MODE" == "true" ]]; then
        log_info "Deploying to PREVIEW..."
        deploy_command="$VERCEL_CMD --yes"
    else
        # Ask user
        echo ""
        echo -e "${YELLOW}Select deployment type:${NC}"
        echo "  1) Preview (development)"
        echo "  2) Production"
        read -p "Choice (1 or 2): " -n 1 -r choice
        echo ""

        case $choice in
            2)
                log_info "Deploying to PRODUCTION..."
                deploy_command="$VERCEL_CMD --prod --yes"
                ;;
            *)
                log_info "Deploying to PREVIEW..."
                deploy_command="$VERCEL_CMD --yes"
                ;;
        esac
    fi

    # Execute deployment
    log_info "Executing: $deploy_command"
    $deploy_command || {
        log_error "Deployment failed!"
        exit 1
    }

    log_success "Deployment completed!"
}

# =============================================================================
# Get Deployment Info
# =============================================================================
get_deployment_info() {
    log_step "Getting deployment information..."

    # Get vercel command path
    if [[ -z "${VERCEL_CMD:-}" ]]; then
        VERCEL_CMD=$(get_vercel_path)
    fi

    # Try to get deployment URL
    local deployment_url
    if [[ -n "$VERCEL_CMD" ]] && command -v jq &> /dev/null; then
        deployment_url=$("$VERCEL_CMD" ls --json 2>/dev/null | jq -r '.[0].url' 2>/dev/null || echo "")
    fi

    if [[ -z "$deployment_url" ]]; then
        deployment_url="https://${VERCEL_PROJECT_NAME}.vercel.app"
    fi

    echo ""
    echo -e "${GREEN}🎉 Deployment Completed Successfully!${NC}"
    echo -e "${GREEN}=================================================${NC}"
    echo ""
    echo -e "${BLUE}📋 Deployment Information:${NC}"
    echo ""
    echo -e "  • Application URL: ${CYAN}${deployment_url}${NC}"
    echo -e "  • Dashboard: ${CYAN}https://vercel.com/dashboard${NC}"
    echo -e "  • GitHub Repository: ${CYAN}${GITHUB_URL}${NC}"
    echo ""
}

# =============================================================================
# Show Next Steps
# =============================================================================
show_next_steps() {
    echo -e "${BLUE}🔧 Next Steps:${NC}"
    echo ""
    echo "1. Configure environment variables in Vercel Dashboard"
    echo "2. Test all features and integrations"
    echo "3. Setup custom domain (optional)"
    echo "4. Configure monitoring and analytics"
    echo "5. Review deployment logs in Vercel Dashboard"
    echo ""
    echo -e "${BLUE}🔗 Quick Links:${NC}"
    echo ""
    echo "  • Vercel Dashboard: https://vercel.com/dashboard"
    echo "  • Project Settings: https://vercel.com/dashboard"
    echo "  • Environment Variables: https://vercel.com/dashboard"
    echo "  • Deployment Logs: https://vercel.com/dashboard"
    echo ""
}

# =============================================================================
# Main Function
# =============================================================================
main() {
    show_banner

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force-build|-f)
                FORCE_BUILD=true
                shift
                ;;
            --skip-tests|-s)
                SKIP_TESTS=true
                shift
                ;;
            --preview|-p)
                PREVIEW_MODE=true
                shift
                ;;
            --production|--prod)
                PRODUCTION_MODE=true
                shift
                ;;
            --auto-commit|-a)
                AUTO_COMMIT=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            --version|-v)
                echo "${PROJECT_NAME} - Vercel Deployment Script v${PROJECT_VERSION}"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Run deployment steps
    check_prerequisites
    install_vercel_cli
    check_vercel_login
    check_git_status
    run_pre_deploy_tests
    check_environment_variables
    build_application
    deploy_to_vercel
    get_deployment_info
    show_next_steps

    log_success "All done! 🚀"
}

# =============================================================================
# Help Function
# =============================================================================
show_help() {
    cat << EOF
Usage: $0 [OPTIONS]

Options:
  --force-build, -f       Force rebuild even if build folder exists
  --skip-tests, -s        Skip pre-deploy tests
  --preview, -p           Deploy to preview environment
  --production, --prod    Deploy to production environment
  --auto-commit, -a       Automatically commit changes before deploy
  --help, -h              Show this help message
  --version, -v           Show version information

Examples:
  $0                      # Interactive deployment
  $0 --production         # Deploy to production
  $0 --preview --skip-tests   # Deploy to preview, skip tests
  $0 --force-build --prod # Force rebuild and deploy to production

This script will:
  1. Check prerequisites (Node.js, npm, Vercel CLI)
  2. Build the application for production
  3. Deploy to Vercel
  4. Show deployment summary and next steps

EOF
}

# =============================================================================
# Run Main
# =============================================================================
main "$@"
