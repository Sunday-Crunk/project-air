#!/usr/bin/env bun

// air-launch.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const httpServer = require('http-server');

// Initialize Neutralino App
const initNeutralinoApp = (appPath) => {
  if (!fs.existsSync(path.join(appPath, 'neutralino.config.json'))) {
    execSync('neu init', { cwd: appPath, stdio: 'inherit' });
  }
};

// Update Neutralino Config
const updateNeutralinoConfig = (appPath) => {
  const configPath = path.join(appPath, 'neutralino.config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  config.url = '/index.html';
  config.mode = 'window';
  config.window.width = 800;
  config.window.height = 600;

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

// Gather Component Scripts and write to gather.js
const gatherComponentScripts = (appPath) => {
  const componentsPath = path.join(appPath, 'components');
  const componentFiles = fs.readdirSync(componentsPath);

  const imports = componentFiles.map(file => `import './components/${file}';`).join('\n');
  const gatherJsPath = path.join(appPath, 'gather.js');
  fs.writeFileSync(gatherJsPath, imports);
};

// Launch Air.js App
const launchAirApp = (appName, mode, port) => {
  const appPath = path.join(process.cwd(), appName);

  if (!fs.existsSync(appPath)) {
    console.log(`Air.js app '${appName}' not found.`);
    process.exit(1);
  }

  if (mode === '--desktop') {
    initNeutralinoApp(appPath);
    updateNeutralinoConfig(appPath);
    execSync('neu run', { cwd: appPath, stdio: 'inherit' });
  } else if (mode === '--hosted') {
    const indexHtmlPath = path.join(appPath, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
      console.log(`'index.html' not found in '${appName}' app directory.`);
      process.exit(1);
    }

    // Gather component scripts and write to gather.js
    gatherComponentScripts(appPath);

    const server = httpServer.createServer({
      root: appPath,
      cache: -1, // Disable caching
      robots: true // Enable serving robots.txt
    });

    const selectedPort = port || 8080;
    server.listen(selectedPort, () => {
      console.log(`Local server running at http://localhost:${selectedPort}`);
    });
  } else {
    console.log('Invalid mode. Please choose either --hosted or --desktop.');
    process.exit(1);
  }
};

// Parse Command Line Arguments
const appName = process.argv[2];
const mode = process.argv[3] || '--hosted';
const port = process.argv[4] || 3030;

if (!appName) {
  console.log('Please provide an app name.');
  console.log('Usage: bun air-launch <app-name> [--hosted | --desktop] [port]');
  process.exit(1);
}

if (mode !== '--hosted' && mode !== '--desktop') {
  console.log('Invalid mode. Please choose either --hosted or --desktop.');
  process.exit(1);
}

// Launch Air.js App
launchAirApp(appName, mode, port);
