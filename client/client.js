import { Socket } from 'net';
import { createInterface } from 'readline';

// --- Configuration ---
const HOST = '127.0.0.1';
const PORT = 3000;

// --- Initialization ---
const client = new Socket();
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// --- Client Event Handlers ---

// Fired when connection is successfully established
client.on('connect', () => {
  console.log('✅ Connected to the scheduler server!');
  rl.prompt();
});

// Fired when data is received from the server
client.on('data', (data) => {
  const serverResponse = data.toString();
  console.log('\nServer Response:');
  
  // Try to parse the response as JSON for better formatting
  try {
    const jsonResponse = JSON.parse(serverResponse);
    if (jsonResponse.status === 'SUCESSO' && Array.isArray(jsonResponse.dados)) {
        console.table(jsonResponse.dados); // Use table format for lists
    } else {
        console.log(jsonResponse);
    }
  } catch (error) {
    // If it's not JSON, just print the raw string
    console.log(serverResponse);
  }

  rl.prompt(); // Show prompt again for next user command
});

// Fired when the server closes the connection
client.on('close', () => {
  console.log('🔌 Connection closed.');
  process.exit();
});

// Fired when a connection error occurs
client.on('error', (err) => {
  console.error(`❌ Connection error: ${err.message}`);
  process.exit();
});

// --- Readline Event Handler ---

// Fired when the user presses Enter in the terminal
rl.on('line', (line) => {
  const input = line.trim();
  if (input) {
    // Send the user command to the server, appending the protocol delimiter (\n)
    client.write(input + '\n');
  }
  rl.prompt();
});

// --- Initial Connection ---
client.connect(PORT, HOST);