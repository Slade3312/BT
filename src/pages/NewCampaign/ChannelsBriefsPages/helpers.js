export const composeOrderSenderNameRegexpValidator = message => value => {
  return !/^[a-zA-Z0-9]+$/.test(value) ? message : undefined;
};

export const composeTestNumbersValidator = message => (value) => {
  /** validator does not make field required */
  if (!value && typeof value !== 'string') return undefined;
  if (!value.match(/^9[0-9]{9}(,\n?\s*9[0-9]{9}){0,2}$/)) return message;
  return undefined;
};
