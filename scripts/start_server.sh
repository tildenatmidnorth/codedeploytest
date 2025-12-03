#!/bin/bash
set -e

cd /home/ec2-user/app

# Start the Node.js server in the background
echo "Starting Node.js server..."
sudo -u ec2-user nohup node server.js > /home/ec2-user/app/server.log 2>&1 &

# Wait a moment and check if server started
sleep 3

if pgrep -f "node server.js" > /dev/null
then
    echo "Server started successfully"
else
    echo "Server failed to start"
    exit 1
fi
