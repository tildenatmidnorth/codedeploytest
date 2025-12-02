#!/bin/bash

# Stop the Node.js server
echo "Stopping Node.js server..."
pkill -f "node server.js" || true

# Wait for process to stop
sleep 2

echo "Server stopped"
