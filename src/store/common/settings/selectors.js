import Cookies from 'js-cookie';

import { __getCommonData } from '../../selectors';


/** @private, do not use this method in components, use lower level fields instead */
export const __getCommonSettings = state => __getCommonData(state).settings;

export const getCommonPageLoaded = state => __getCommonSettings(state).pageLoaded;

/**
 * Selector wrapper for cookies to prevent issues with server render,
 * will return undefined for all cookies until page is loaded
 *
 * !!! IMPORTANT: All the cookie selectors must be using this as a wrapper in the following format:
 * With redux:
 * createSelector(
 *   getValueOfCookie(customCookieNameSelector),
 *   ...otherSelectors,
 *   (cookieValue, ...otherValues) => ...
 * );
 *
 * Without reselect:
 * const cookieValue = getValueOfCookie(customCookieNameSelector)(state);
 */
export const getValueOfCookie = cookieNameSelector => (state, ownProps) => {
  const cookieName = cookieNameSelector(state, ownProps);
  console.assert(cookieName, 'attempting to get value of cookie without passing a proper name');
  const pageLoaded = getCommonPageLoaded(state);
  return pageLoaded && cookieName ? Cookies.get(cookieName) : undefined;
};

export const getCurrentRelease = state => __getCommonSettings(state).release;
