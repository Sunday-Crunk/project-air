#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const express = require('express');
const acorn = require('acorn');

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

const launchAirApp = (appName, mode = '--hosted', port = 3030) => {
  const appPath = path.join(process.cwd(), appName);
  if (!fs.existsSync(appPath)) {
    console.log(`Air.js app '${appName}' not found.`);
    process.exit(1);
  }
  console.log(`Launching Air.js app '${appName}' in ${mode} mode...`);

  if (mode === '--desktop') {
    // Desktop-specific logic here (unchanged)
  } else if (mode === '--hosted') {
    const indexHtmlPath = path.resolve(appPath, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
      console.log(`'index.html' not found in '${appName}' app directory.`);
      process.exit(1);
    }

    const app = express();

    // Serve static files from the app directory
    app.use(express.static(appPath));

    // Check if a backend folder exists
    const backendPath = path.join(appPath, 'backend');
    if (fs.existsSync(backendPath)) {
      console.log('Backend folder detected. Attempting to start backend server...');
      
      // Look for common backend entry points
      const possibleEntryPoints = ['server.js', 'app.js', 'index.js'];
      let entryPoint = possibleEntryPoints.find(file => fs.existsSync(path.join(backendPath, file)));
      
      if (entryPoint) {
        console.log(`Found backend entry point: ${entryPoint}`);
        // Start the backend server
        const backend = require(path.join(backendPath, entryPoint));
        
        // If the backend exports an Express app or a server, use it
        if (typeof backend === 'function') {
          app.use(backend);
        } else if (backend.app) {
          app.use(backend.app);
        } else {
          console.log('Backend detected but unable to integrate. Ensure it exports an Express app or middleware.');
        }
      } else {
        console.log('No recognized backend entry point found. Skipping backend integration.');
      }
    }

    // Serve index.html for all other routes (frontend routing)
    app.get('*', (req, res, next) => {
      if (path.extname(req.path).length > 0) {
        return next();
      }
      res.sendFile(indexHtmlPath);
    });

    const selectedPort = port || 8080;
    app.listen(selectedPort, () => {
      console.log(`Server running at http://localhost:${selectedPort}`);
      console.log(`Frontend served from: ${appPath}`);
      if (fs.existsSync(backendPath)) {
        console.log(`Backend integrated from: ${backendPath}`);
      }
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