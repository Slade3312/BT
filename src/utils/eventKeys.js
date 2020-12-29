/**
 * checking keyCode is incapsulated into function,
 * because modifier keys may change keyCodes
 */
export const isEscapePressed = event => event.keyCode === 27;
