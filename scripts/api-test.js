#!/usr/bin/env node

const https = require('https');

// API URL to test
const apiUrl = process.argv[2] || 'https://stello-pipe2.onrender.com/api';

console.log(`Testing API connectivity to: ${apiUrl}`);

// Function to make an HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
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
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Request error: ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timed out after 10 seconds'));
    });
    
    req.end();
  });
}

// Run the test
async function runTest() {
  try {
    console.log('Making request...');
    const result = await makeRequest(apiUrl);
    
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