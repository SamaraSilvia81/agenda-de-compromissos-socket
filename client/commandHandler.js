const validCommands = ['ADD', 'LIST', 'UPDATE', 'DELETE'];

export function processUserInput(line) {
  const input = line.trim();
  if (!input) {
    return { success: false };
  }

  const [command] = input.split(' ');
  const commandUpper = command.toUpperCase();

  if (!validCommands.includes(commandUpper)) {
    const errorMsg = `❌ Invalid command: "${command}". Try one of: ${validCommands.join(', ')}`;
    return { success: false, error: errorMsg };
  }

  // --- Command-specific validation ---
  switch (commandUpper) {
    case 'ADD': {
      // Regex to capture arguments, allowing for quoted title and optional quoted description.
      // Groups: 1:date, 2:time, 3:duration, 4:title, 5:description(optional)
      const addRegex = /^ADD\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+"([^"]+)"(?:\s+"([^"]+)")?$/i;
      const match = input.match(addRegex);

      if (!match) {
        const errorMsg = '❌ Incorrect format for ADD. Use: ADD <date> <time> <duration> "<title>" "[optional_description]"';
        return { success: false, error: errorMsg };
      }
      
      // If format is correct, proceed.
      // Future validation for date/time format could be added here.
      break;
    }

    case 'LIST':
    case 'UPDATE':
    case 'DELETE':
      break;

    default:
      // Should not be reached due to the initial command validation.
      break;
  }

  // If all checks pass, the command is valid.
  return { success: true, commandToSend: input + '\n' };
}