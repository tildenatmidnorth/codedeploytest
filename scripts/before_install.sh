#!/bin/bash
set -e

# Update system packages
yum update -y

# Install Node.js if not already installed
if ! command -v node &> /dev/null
then
    echo "Installing Node.js..."
    curl -sL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi

# Create app directory if it doesn't exist
mkdir -p /home/ec2-user/app

# Stop the application if it's running
echo "Stopping application if running..."
pkill -f "node server.js" || true

# Clean up old deployment files
echo "Cleaning up old files..."
rm -rf /home/ec2-user/app/*
