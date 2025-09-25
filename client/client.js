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

// --- Client Event Handlers ---

client.on('connect', () => {
  isConnected = true;
  console.log('✅ Connected to the scheduler server!');
  rl.prompt();
});

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
  // eslint-disable-next-line no-unused-vars
  } catch (_err) {
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
});

// --- Readline Event Handler ---

rl.on('line', (line) => {
  const result = processUserInput(line);

  if (result.success) {
    console.log(`[DEBUG] Command formated: "${result.commandToSend.trim()}"`);
    client.write(result.commandToSend);
  } else if (result.errorCode) {
    handleError(result.errorCode);
    rl.prompt();
  } else {
    rl.prompt();
  }
});

// --- Initial Connection ---
client.connect(PORT, HOST);