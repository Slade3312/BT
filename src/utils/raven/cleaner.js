import { compose } from 'redux';

/**
 * given a string containing GUID, replaces it with escaped mock
 */
// const escapeGUID = str => str.replace(/\w{9}-\w{4}-\w{4}-\w{4}-\w{12}/g, 'raven-escaped-hash');
const stripQuery = url => url.replace(/\?.*/, '');
/**
 * We can't trust page source code,
 * as it changes every time, so we remove context and column
 */
const escapeGlobalCodeContext = (frame) => {
  if (
    stripQuery(frame.filename) === window.location.pathname ||
    stripQuery(frame.filename) === stripQuery(window.location.href)
  ) {
    delete frame.colno;
    delete frame.lineno;
  }
  return frame;
};


/**
 *
 */
const removeRavenReference = (frame) => {
  if (
    frame.module &&
    frame.module.startsWith('raven-js') ||

    frame.filename &&
    frame.filename.endsWith('/raven.js')
  ) return null;
  return frame;
};

/**
 * mutates data, cleans up all the noise that may result in task splitting for sentry
 */
export const cleanExceptionNoise = (exception) => {
  const { stacktrace } = exception.values[0];
  stacktrace.frames = stacktrace.frames
    .map(item => compose(removeRavenReference, escapeGlobalCodeContext)(item))
    .filter(item => !!item);
  return exception;
};
