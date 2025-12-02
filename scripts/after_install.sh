#!/bin/bash
set -e

cd /home/ec2-user/app

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Build React app if needed
if [ -d "client" ]; then
    echo "Building React app..."
    cd client
    npm install
    npm run build
    cd ..
fi

# Set proper permissions
chown -R ec2-user:ec2-user /home/ec2-user/app
