import { Socket } from 'net';
import { createInterface } from 'readline';
import { processUserInput } from './commandHandler.js';
import { handleError } from './errorHandler.js';

// --- Display Functions ---
function showWelcomeMessage() {
  console.clear();
  console.log("---------------------------------------------------------------------");
  console.log(" Disciplina: Plataformas de Distribuição - UFPE (2025.2)");
  console.log(" Professor: Nelson Souto (nsr@cin.ufpe.br)");
  console.log(" Autores: Samara Silvia (sssc@cin.ufpe.br)");
  console.log("          Rodolfo Marinho (armc2@cin.ufpe.br)");
  console.log("\n Título: Agenda de Compromissos Distribuída v1.0");
  console.log("\n Descrição:");
  console.log("   Esta é uma aplicação de linha de comando (CLI) que atua como um");
  console.log("   cliente para um sistema de agenda compartilhada. Ela se comunica");
  console.log("   via Sockets TCP com um servidor para manipular eventos em tempo real.");
  console.log("\n Comandos disponíveis:");
  console.log("   - HELP         (Veja a lista completa de comandos e seus formatos)");
  console.log("   - CLEAR        (Limpe a tela do terminal)");
  console.log("   - EXIT         (Encerre a aplicação)");
  console.log("---------------------------------------------------------------------");
}

function showCommandTutorial() {
  console.log("\n---------- Guia de Comandos da Agenda ----------");
  console.log('\n➡️  ADD <data> <hora> <duração> "<título>" "[descrição]"');
  console.log('    Ex: add 2025-09-26 10:00 60min "Reunião de Projeto"');
  console.log('\n➡️  LIST <data | ALL>');
  console.log('    Ex: list 2025-09-26');
  console.log('\n➡️  UPDATE <id> <campo> "<novo_valor>"');
  console.log('    Ex: update 42 titulo "Título da Reunião Atualizado"');
  console.log('\n➡️  DELETE <id>');
  console.log('    Ex: delete 42');
  console.log("------------------------------------------------");
}

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
  showWelcomeMessage();
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
    console.log('Disconnecting...');
    console.log('\nAgradecemos por usar a Agenda Distribuída! Até a próxima. 👋');
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