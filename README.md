# CodeDeploy Test App

A simple Hello World React + Node.js application for testing AWS CodeDeploy.

## Features
- React frontend (using CDN, no build required)
- Express.js backend
- AWS CodeDeploy configuration

## Local Development

```bash
npm install
npm start
```

Visit `http://localhost:3000`

## Deployment

This app is configured for AWS CodeDeploy. The `appspec.yml` file defines the deployment process.

### Prerequisites on EC2:
- CodeDeploy agent installed and running
- Node.js installed (script will install if missing)
- Port 3000 open in security group

### Deployment Process:
1. ApplicationStop - Stops running server
2. BeforeInstall - Cleans up and prepares environment
3. Install - Copies files to /home/ec2-user/app
4. AfterInstall - Installs npm dependencies
5. ApplicationStart - Starts the Node.js server

## Project Structure

```
.
├── appspec.yml           # CodeDeploy configuration
├── scripts/              # Deployment lifecycle scripts
│   ├── before_install.sh
│   ├── after_install.sh
│   ├── start_server.sh
│   └── stop_server.sh
├── server.js             # Node.js Express server
├── package.json          # Node.js dependencies
└── public/
    └── index.html        # React frontend
```

## Testing After Deployment

1. Get your EC2 public IP
2. Visit `http://YOUR_EC2_IP:3000`
3. Click "Test Backend Connection" to verify frontend-backend communication
