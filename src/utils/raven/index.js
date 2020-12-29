import Raven from 'raven-js';
import { eventDataFilter, eventFilter } from './filters';


/**
 * Pass _noRaven or _noRaven as query param
 * to disable sentry for a web page
 */
const isRavenEnabled = /_no(?:sentry|raven)/i.test(window.location.search);

/** override Raven.config to insert extra params */
export default {
  ...Raven,
  config: (dns, options = {}) => (
    Raven.config(dns, {
      ...options,
      /** stop catching console logs and changing where they are originating */
      autoBreadcrumbs: {
        console: false,
      },
      dataCallback: eventDataFilter,
      shouldSendCallback: eventFilter,
    })
  ),

  /** Disable raven by passing &_noRaven */
  ...(isRavenEnabled ? { config: () => ({ install: () => null }) } : {}),
};
