/**
 * Fetchers may either return date instantly or a promise
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const endlessPromise = new Promise(() => null);
