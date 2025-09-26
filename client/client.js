// client/client.js

import { Socket } from 'net';
import { createInterface } from 'readline';
import { processUserInput } from './commandHandler.js';
import { handleError } from './errorHandler.js';

// --- Configuration ---
const HOST = '127.0.0.1';
const PORT = 3000;

// --- Initialization ---
const client = new Socket();
let isConnected = false;
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.setPrompt('\n> ');

// --- Client-Side Command Handlers ---

function displayHelp() {
  console.log('\n--- Available Commands ---');
  console.log('ADD <date> <time> <duration> "<title>" "[description]" - Add a new appointment.');
  console.log('LIST [date]                                           - List all or filtered appointments.');
  console.log('UPDATE <id> <field> "<new_value>"                     - Update an appointment.');
  console.log('DELETE <id>                                           - Delete an appointment.');
  console.log('HELP                                                  - Show this help message.');
  console.log('CLEAR                                                 - Clear the console screen.');
  console.log('EXIT                                                  - Disconnect and close the application.');
  console.log('--------------------------');
}

// --- Client Event Handlers ---

client.on('connect', () => {
  isConnected = true;
  console.log('✅ Connected to the scheduler server!');
  displayHelp(); // Show help on initial connection
  rl.prompt();
});

client.on('data', (data) => {
  const serverResponse = data.toString();
  console.log('\nServer Response:');
  
  try {
    const jsonResponse = JSON.parse(serverResponse);
    // Use console.table for successful LIST commands
    if (jsonResponse.status === 'SUCESSO' && Array.isArray(jsonResponse.dados)) {
        console.table(jsonResponse.dados);
    } else {
        console.log(jsonResponse);
    }
  // eslint-disable-next-line no-unused-vars
  } catch (_err) {
    // Fallback for non-JSON responses
    console.log(serverResponse);
  }
  rl.prompt();
});

client.on('close', () => {
  console.log('🔌 Connection closed.');
  if (isConnected) {
    process.exit();
  }
});

client.on('error', (err) => {
  handleError('CONNECTION_ERROR', err);
  // If connection fails on start, rl might not be available.
  if (rl) {
    rl.close();
  }
});

// --- Readline Event Handler ---

rl.on('line', (line) => {
  const command = line.trim().toUpperCase();

  // --- Handle Client-Side Commands First ---
  if (command === 'EXIT') {
    console.log('Disconnecting...');
    client.end();
    rl.close();
    return;
  }
  
  if (command === 'CLEAR') {
    console.clear();
    rl.prompt();
    return;
  }

  if (command === 'HELP') {
    displayHelp();
    rl.prompt();
    return;
  }

  // --- Process and Send Server-Side Commands ---
  const validation = processUserInput(line);

  if (validation.success) {
    client.write(line.trim());
  } else if (validation.errorCode) {
    handleError(validation.errorCode);
    rl.prompt();
  } else {
    // Handle empty line case
    rl.prompt();
  }
});

// --- Initial Connection ---
console.log('Connecting to server...');
client.connect(PORT, HOST, () => {
  // Connection listener is handled by the 'connect' event
});