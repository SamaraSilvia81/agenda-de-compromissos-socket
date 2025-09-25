// List of valid commands that the client accepts
const validCommands = ['ADD', 'LIST', 'UPDATE', 'DELETE'];

/**
 * Processes the raw user input from the command line.
 * @param {string} line The raw string typed by the user.
 * @returns {object} An object with the result of the processing.
 */
export function processUserInput(line) {
  const input = line.trim();
  if (!input) {
    // Return success: false but no error message for empty lines
    return { success: false };
  }

  const [command] = input.split(' ');
  const commandUpper = command.toUpperCase();

  // Validate if the command is in our list
  if (!validCommands.includes(commandUpper)) {
    const errorMsg = `❌ Invalid command: "${command}". Try one of: ${validCommands.join(', ')}`;
    return { success: false, error: errorMsg };
  }

  // If everything is okay, return the command ready to be sent
  return { success: true, commandToSend: input + '\n' };
}