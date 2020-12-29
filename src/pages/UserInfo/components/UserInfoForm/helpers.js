export const composeUserInitialsValidator = message => value =>
  (!/^[а-яА-ЯёЁ'\s-]+$/.test(value) ? message : undefined);

export const composeUserInitialsLengthValidator = message => value =>
  (!(typeof value === 'string' && value.replace(/\s+/g, '').length >= 2) ? message : undefined);
