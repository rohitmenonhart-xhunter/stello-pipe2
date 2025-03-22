const fs = require('fs');

const output = `
Node.js is working!
Current directory: ${process.cwd()}
Node version: ${process.version}
`;

fs.writeFileSync('api/test-output.txt', output);
console.log('Output written to test-output.txt'); 