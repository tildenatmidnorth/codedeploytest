# CodeDeploy Test App

## Overview
A simple Hello World React + Node.js application originally designed for AWS CodeDeploy testing. This app features a React frontend (loaded via CDN) with an Express.js backend serving both static files and API endpoints.

**Current State**: Successfully configured for Replit environment (December 03, 2025)

## Project Architecture

### Technology Stack
- **Frontend**: React 18 (loaded via CDN, no build step required)
- **Backend**: Express.js (Node.js)
- **Package Manager**: npm
- **Dev Server**: nodemon for auto-reload

### Structure
```
.
├── server.js              # Express server (port 5000, binds to 0.0.0.0)
├── package.json           # Node.js dependencies
├── public/
│   └── index.html        # React frontend with inline components
├── scripts/              # AWS CodeDeploy lifecycle scripts (not used in Replit)
└── appspec.yml           # AWS CodeDeploy config (not used in Replit)
```

### Key Configuration
- **Port**: 5000 (Replit standard for frontend)
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Cache Control**: Disabled for static files to prevent iframe caching issues
- **API Endpoint**: `/api/hello` - Returns JSON greeting

## Recent Changes (December 03, 2025)

### Replit Environment Setup
1. Modified `server.js`:
   - Changed default port from 3000 to 5000
   - Bound server to `0.0.0.0` instead of default localhost
   - Added cache control headers for static files (`Cache-Control: no-cache`)
2. Created workflow "Start application" using `npm run dev` (nodemon)
3. Configured webview output on port 5000

## How It Works
The Express server serves the React frontend from the `/public` directory and provides a simple API endpoint. The React app is a single-page application that makes a fetch request to the backend when the user clicks the "Test Backend Connection" button.

## User Preferences
None documented yet.
