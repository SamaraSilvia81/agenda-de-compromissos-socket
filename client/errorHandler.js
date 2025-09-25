/**
 * Handles displaying standardized error messages to the user.
 * @param {string} errorCode A unique code for the error type.
 * @param {Error} [originalError=null] The original error object for debugging.
 */
export function handleError(errorCode, originalError = null) {
  let userMessage = `❌ Erro inesperado.`; // Default message

  switch (errorCode) {
    case 'INVALID_COMMAND':
      userMessage = `❌ Comando inválido. Use um dos comandos conhecidos.`;
      break;
    case 'INVALID_ADD_FORMAT':
      userMessage = '❌ Formato incorreto. Use: ADD <data> <hora> <duração> "<título>" "[descrição]"';
      break;
    case 'INVALID_LIST_FORMAT':
      userMessage = '❌ Formato incorreto. Use: LIST, LIST <date>, ou LIST ALL';
      break;
    case 'INVALID_UPDATE_FORMAT':
      userMessage = '❌ Formato incorreto. Use: UPDATE <id> <field> "<new_value>"';
      break;
    case 'INVALID_DELETE_FORMAT':
      userMessage = '❌ Formato incorreto. Use: DELETE <id>';
      break;
    case 'CONNECTION_ERROR':
      userMessage = `❌ Erro de conexão: ${originalError.message}`;
      break;
    
  }

  console.error(userMessage);
}