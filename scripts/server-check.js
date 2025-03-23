#!/usr/bin/env node

/**
 * Server Status Check Tool
 * 
 * This script checks if the local API server is running correctly.
 * It verifies various aspects of the server configuration and connection.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const os = require('os');

// Load environment variables
const envPath = process.argv[2] === '--prod' 
  ? path.resolve(process.cwd(), '.env.production')
  : path.resolve(process.cwd(), '.env.development');

try {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  // Set environment variables
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
  
  console.log(`Loaded environment from: ${envPath}`);
} catch (error) {
  console.warn(`Warning: Could not load environment file from ${envPath}`);
  console.warn('Using default environment variables');
}

// Configuration
const SERVER_PORT = process.env.PORT || 8080;
const API_BASE_URL = process.env.VITE_API_BASE_URL || `http://localhost:${SERVER_PORT}/api`;

// Extract host and path
const url = new URL(API_BASE_URL);
const options = {
  hostname: url.hostname,
  port: url.port || (url.protocol === 'https:' ? 443 : 80),
  path: url.pathname,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

console.log('\n======================================');
console.log('🔍 SERVER STATUS CHECK');
console.log('======================================\n');

// System information
console.log('System Information:');
console.log(`OS: ${os.type()} ${os.release()}`);
console.log(`Node.js: ${process.version}`);
console.log(`Working directory: ${process.cwd()}`);
console.log('');

// Environment variables
console.log('Environment Variables:');
console.log(`PORT: ${process.env.PORT || '(not set, using default 8080)'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
console.log(`VITE_API_BASE_URL: ${process.env.VITE_API_BASE_URL || '(not set)'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '(set)' : '(not set)'}`);
console.log('');

// Check if the server process is running
console.log('Checking for running server processes...');
const { execSync } = require('child_process');

try {
  const command = process.platform === 'win32'
    ? `netstat -ano | findstr :${SERVER_PORT}`
    : `lsof -i :${SERVER_PORT} | grep LISTEN`;
  
  const result = execSync(command, { encoding: 'utf8' });
  console.log(`✅ Found server running on port ${SERVER_PORT}`);
  console.log(result);
} catch (error) {
  console.log(`❌ No server detected running on port ${SERVER_PORT}`);
}
console.log('');

// Test the API connection
console.log(`Testing API connection to: ${API_BASE_URL}`);
console.log('Request options:', options);

function makeRequest() {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      console.log(`Response status code: ${res.statusCode}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Try to parse as JSON
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          // Return as text if not JSON
          console.warn('Response is not valid JSON');
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timed out after 5 seconds'));
    });
    
    req.end();
  });
}

async function runTest() {
  try {
    console.log('Making request...');
    const result = await makeRequest();
    
    console.log('\nAPI Response:');
    console.log(JSON.stringify(result.data, null, 2));
    
    if (result.status >= 200 && result.status < 300) {
      console.log('\n✅ API is reachable and returned a success response!');
    } else {
      console.log(`\n❌ API returned a non-success status code: ${result.status}`);
    }
  } catch (error) {
    console.error(`\n❌ Failed to connect to API: ${error.message}`);
  }

  console.log('\n======================================');
  console.log('SERVER CHECK COMPLETE');
  console.log('======================================');
}

runTest(); 