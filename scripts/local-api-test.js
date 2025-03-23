#!/usr/bin/env node

const http = require('http');

// API URL to test - default to local API
const apiUrl = process.argv[2] || 'http://localhost:8080/api';

console.log(`Testing API connectivity to: ${apiUrl}`);

// Extract host and path from URL
const url = new URL(apiUrl);
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

console.log('Request options:', options);

// Function to make an HTTP request
function makeRequest() {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      // Log status code
      console.log(`Response status code: ${res.statusCode}`);
      console.log(`Response headers: ${JSON.stringify(res.headers, null, 2)}`);
      
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
          console.log('Response is not valid JSON. Raw response:');
          console.log(data);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Request error: ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timed out after 5 seconds'));
    });
    
    req.end();
  });
}

// Run the test
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
}

runTest(); 