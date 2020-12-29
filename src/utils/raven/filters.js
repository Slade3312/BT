import { isSupportedUA } from './browserslist-useragent';
import { cleanExceptionNoise } from './cleaner';


/** check if event has properly inserted exception data */
const hasExceptionInfo = ({ exception }) =>
  exception && exception.values && exception.values.length && (exception.values[0].value || exception.values[0].type);

/** retrieve error message either from exception.value or from raw error message */
const getErrorMessage = ({ exception, message }) => (
  hasExceptionInfo({ exception, message }) ? `${exception.values[0].type}: ${exception.values[0].value}` : message
);

/** retrieve error stack trace */
const getErrorStacktrace = data => hasExceptionInfo(data) && data.exception.values[0].stacktrace.frames || [];

/** retrieve the first domain listen in error message */
const getErrorRelatedDomain = data => (getErrorMessage(data).match(/https?:\/\/([^/?"' ]+)/) || [])[1] || null;

/**
 * Raven file is only supposed to be used client-side,
 * thus navigator.userAgent is used openly
 */
const isLegacyBrowser = !isSupportedUA(navigator.userAgent);
const isSecurityError = (data) => {
  const error = getErrorMessage(data);
  return error.indexOf('SecurityError') !== -1 && error.indexOf('Content Security Policy') !== -1;
};

export function eventDataFilter(data) {
  try {
    const { exception } = data;

    /**
     * For Content Security Policy errors, we stack them by blocked domain name
     */
    if (isSecurityError(data)) {
      const blockedDomain = getErrorRelatedDomain(data);
      if (blockedDomain) data.fingerprint = [`CSP:${blockedDomain}`];
      return data;
    }

    /** safety check first, error is present */
    if (hasExceptionInfo(data)) {
      /**
       * for legacy browser we just stack all events into single issue
       * Replacing the error type by LegacyError
       */
      if (isLegacyBrowser) {
        data.fingerprint = ['Error by legacy browser'];
        exception.values[0].value = `${exception.values[0].type} ${exception.values[0].value}`;
        exception.values[0].type = 'LegacyError';
        return data;
      }

      /**
       * Stack all jQuery is missing events into a single issue
       */
      const errorMessage = getErrorMessage(data);
      if (errorMessage.match(/(?:Can't find variable: \$|\$ is not defined)/)) {
        data.fingerprint = ['Can`t find jQuery'];
        return data;
      }

      /**
       * Stack gtm.js events by title
       */
      const isGtmError = getErrorStacktrace(data)
        .some(frame => (frame.filename || '').indexOf('/gtm.js') !== -1);
      if (isGtmError) {
        data.fingerprint = [getErrorMessage(data).replace(/\d+/g, '\\d')];
        return data;
      }

      // data.extra = {
      //   ...data.extra,
      //   originalException: JSON.stringify(data, null, 2),
      // };

      /** common cleanup for exceptions, remove noise that results in additional task splitting */
      cleanExceptionNoise(data.exception);
    }
  } catch (ex) {
    data.extra = {
      ...data.extra,
      processError: `Encountered error in call to eventDataFilter: ${ex.message}\n${JSON.stringify(ex.stack, null, 2)}`,
    };
  }
  return data;
}

const CSPBlacklist = [
  'plugin.ucads.ucweb.com',
];

const isDomainBacklisted = testDomain => CSPBlacklist.some(blackListEntry => testDomain.indexOf(blackListEntry) !== -1);

export function eventFilter(data) {
  try {
    if (isSecurityError(data)) {
      const blockedDomain = getErrorRelatedDomain(data);
      return !isDomainBacklisted(blockedDomain);
    }
  } catch (ex) {
    data.extra = {
      ...data.extra,
      processError: `Encountered error in call to eventFilter: ${ex.message}\n${JSON.stringify(ex.stack, null, 2)}`,
    };
  }
  return true;
}
