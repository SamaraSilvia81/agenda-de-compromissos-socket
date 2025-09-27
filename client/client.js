import { Socket } from 'net';
import { createInterface } from 'readline';
import { processUserInput } from './commandHandler.js';
import { handleError } from './errorHandler.js';
import { showConnectionAnimation, showWelcomeMessage, showCommandTutorial, showGoodbyeScreen } from './messages.js';

// --- Configuration ---
const HOST = '127.0.0.1';
const PORT = 3000;

// --- Initialization ---
const client = new Socket();
let isConnected = false;
const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.setPrompt('\n> ');

// --- Client Event Handlers ---
client.on('connect', () => {
  isConnected = true;
   showConnectionAnimation(() => {
    showWelcomeMessage();
    rl.prompt();
  });
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
  if (!isConnected) {
    showWelcomeMessage();
  }
  handleError('CONNECTION_ERROR', err);
  if (!isConnected) {
    rl.prompt();
  }
});

// --- Readline Event Handler ---
rl.on('line', (line) => {
  const input = line.trim();
  const commandUpper = input.split(' ')[0].toUpperCase();

  if (commandUpper === 'HELP') {
    showCommandTutorial();
    rl.prompt();
    return;
  }
  if (commandUpper === 'CLEAR') {
    showWelcomeMessage();
    rl.prompt();
    return;
  }
  if (commandUpper === 'EXIT') {
    showGoodbyeScreen();
    client.end();
    rl.close();
    return;
  }

  const result = processUserInput(input);

  if (result.success) {
    console.log(`[DEBUG] Command formatted: "${result.commandToSend.trim()}"`);
    client.write(result.commandToSend);
  } else if (result.errorCode) {
    handleError(result.errorCode);
    rl.prompt();
  } else {
    rl.prompt();
  }
});

// --- Initial Connection ---
console.log('Attempting to connect to the server...');
client.connect(PORT, HOST);