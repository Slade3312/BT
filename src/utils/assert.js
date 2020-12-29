import { isNullOrUndefined } from './fn';

export const assertBooleanOrNull = (value, funcName = 'function', argName = 'argument') =>
  console.assert(
    typeof value === 'boolean' || isNullOrUndefined(value),
    `Expecting ${argName} to be boolean or null in call to ${funcName}, '${typeof value}' found`,
  );
