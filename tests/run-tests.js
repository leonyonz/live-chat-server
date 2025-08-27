#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

// Function to run a command and return a promise
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Main async function
async function runTests() {
  console.log('Running all tests...\n');
  
  try {
    // Run Jest tests
    console.log('Running Jest tests...');
    const result = await runCommand('npm test');
    console.log(result.stdout);
    
    if (result.stderr) {
      console.error(result.stderr);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Tests failed:');
    console.error(error.stdout);
    console.error(error.stderr);
    process.exit(1);
  }
}

// Run the tests
runTests();
