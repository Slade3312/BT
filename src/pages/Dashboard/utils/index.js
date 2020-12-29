export const replaceHelper = (string, substring, replaceValue) =>
  string.replace(new RegExp(`${substring}`, 'g'), replaceValue);
