#!/bin/bash

echo "================================================"
echo "CodeDeploy Test App - GitHub Setup Script"
echo "================================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "Git is not installed. Please install git first."
    exit 1
fi

# Navigate to the app directory
cd "$(dirname "$0")"

echo "Current directory: $(pwd)"
echo ""

# Get GitHub repository URL
read -p "Enter your GitHub repository URL (e.g., https://github.com/tildenatmidnorth/codedeploytest.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "Repository URL cannot be empty!"
    exit 1
fi

# Get branch name
read -p "Enter branch name (default: main): " BRANCH
BRANCH=${BRANCH:-main}

echo ""
echo "Setting up Git repository..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    echo "✓ Git repository initialized"
else
    echo "✓ Git repository already initialized"
fi

# Configure git (optional - will use your global config if not set)
read -p "Enter your Git username (press Enter to skip): " GIT_USER
if [ ! -z "$GIT_USER" ]; then
    git config user.name "$GIT_USER"
fi

read -p "Enter your Git email (press Enter to skip): " GIT_EMAIL
if [ ! -z "$GIT_EMAIL" ]; then
    git config user.email "$GIT_EMAIL"
fi

echo ""
echo "Adding files to Git..."
git add .

echo ""
echo "Creating commit..."
git commit -m "Add CodeDeploy test app with React and Node.js"

echo ""
echo "Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo ""
echo "Pushing to GitHub..."
git branch -M "$BRANCH"
git push -u origin "$BRANCH"

echo ""
echo "================================================"
echo "✓ Successfully pushed to GitHub!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Go to AWS CodeDeploy console"
echo "2. Create a new deployment"
echo "3. Your app will be deployed to /home/ec2-user/app"
echo "4. Access your app at http://YOUR_EC2_IP:3000"
echo ""
echo "Make sure port 3000 is open in your EC2 security group!"
