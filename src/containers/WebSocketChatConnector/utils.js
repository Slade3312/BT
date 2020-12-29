export const checkIsUserMessage = (message) => !message.is_system_message && !message.operator_message && !message.isDateMessage;
export const checkIsOperatorMessage = (message) => !message.is_system_message && message.operator_message;
