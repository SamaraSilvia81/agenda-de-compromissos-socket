import { Socket } from 'net';
import { createInterface } from 'readline';

// --- Configuration ---
const HOST = '127.0.0.1';
const PORT = 3000;

// --- Initialization ---
const client = new Socket();
let isConnected = false; // State variable to track connection status
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.setPrompt('\n> '); // Set a custom prompt for better readability

// --- Client Event Handlers ---

// Fired when connection is successfully established
client.on('connect', () => {
  isConnected = true; // Set flag to true on successful connection
  console.log('✅ Connected to the scheduler server!');
  rl.prompt();
});

// Fired when data is received from the server
client.on('data', (data) => {
  const serverResponse = data.toString();
  console.log('\nServer Response:');
  
  try {
    const jsonResponse = JSON.parse(serverResponse);
    if (jsonResponse.status === 'SUCESSO' && Array.isArray(jsonResponse.dados)) {
        console.table(jsonResponse.dados);
    } else {
        console.log(jsonResponse);
    }
  } catch (_err) { // Using _error to avoid unused variable linting error
    console.log(serverResponse);
  }

  rl.prompt();
});

// Fired when the server closes the connection
client.on('close', () => {
  console.log('🔌 Connection closed.');
  // Only exit if the connection was previously established
  if (isConnected) {
    process.exit();
  }
});

// Fired when a connection error occurs
client.on('error', (err) => {
  console.error(`❌ Connection error: ${err.message}`);
  // We no longer exit here, allowing the CLI to be tested offline
});

// --- Readline Event Handler ---

// Fired when the user presses Enter in the terminal
rl.on('line', (line) => {
  const input = line.trim();
  if (input) {
    const commandToSend = input + '\n';
    console.log(`[DEBUG] Comando formatado: "${commandToSend.trim()}"`);
    client.write(commandToSend);
  }
  rl.prompt();
});

// --- Initial Connection ---
client.connect(PORT, HOST);