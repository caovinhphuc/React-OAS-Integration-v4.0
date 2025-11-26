#!/bin/bash

# 🚀 MIA.vn Google Integration - Deploy Script
# Automated GitHub push and Vercel deployment

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized!"
    exit 1
fi

# Check if remote origin exists
if ! git remote | grep -q "origin"; then
    print_warning "No remote origin found. Please add your GitHub repository:"
    echo "Example: git remote add origin https://github.com/YOUR_USERNAME/mia-vn-google-integration.git"
    read -p "Enter your GitHub repository URL: " repo_url

    if [ ! -z "$repo_url" ]; then
        print_status "Adding remote origin..."
        git remote add origin "$repo_url"
        print_success "Remote origin added successfully!"
    else
        print_error "Repository URL is required!"
        exit 1
    fi
fi

# Check if there are any uncommitted changes
if ! git diff --quiet HEAD; then
    print_status "Found uncommitted changes. Committing..."
    git add .
    git commit -m "🔧 Update: Pre-deployment changes and optimizations"
    print_success "Changes committed!"
fi

# Push to GitHub
print_status "Pushing to GitHub..."
if git push -u origin main; then
    print_success "Successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub. Please check your credentials and repository access."
    exit 1
fi

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
    print_success "Vercel CLI installed!"
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
print_warning "Please make sure you're logged in to Vercel (run 'vercel login' if needed)"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    print_warning "vercel.json not found. Creating default configuration..."
    cat > vercel.json << EOF
{
  "version": 2,
  "name": "mia-vn-google-integration",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_NODE_ENV": "production"
  }
}
EOF
    print_success "Default vercel.json created!"
fi

# Deploy to Vercel
if vercel --prod --yes; then
    print_success "🎉 Successfully deployed to Vercel!"
    echo ""
    echo "🌐 Your app is now live!"
    echo "📋 Next steps:"
    echo "   1. Configure environment variables in Vercel dashboard"
    echo "   2. Test all features in production"
    echo "   3. Add custom domain if needed"
    echo ""
else
    print_error "Deployment failed. Please check the logs above."
    exit 1
fi

print_success "🎉 Deployment process completed successfully!"
