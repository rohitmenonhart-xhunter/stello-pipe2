#!/usr/bin/env node

const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'https://stello-pipe2.onrender.com';
const TEST_ENDPOINT = '/health';

console.log(`Testing API connection to: ${API_URL}${TEST_ENDPOINT}`);

// Attempt to connect to the API
async function testApiConnection() {
  try {
    const response = await fetch(`${API_URL}${TEST_ENDPOINT}`);
    
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Connection successful!');
      console.log('Response data:', data);
      return true;
    } else {
      console.error(`Error: Server responded with status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Connection failed:', error.message);
    return false;
  }
}

// Run the test
testApiConnection()
  .then(success => {
    console.log('\nAPI Test complete.');
    process.exit(success ? 0 : 1);
  }); 