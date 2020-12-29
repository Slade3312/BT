/**
 * this is a *fork* of `browserslist-useragent`
 * to use the package client-side, instead of parsing browserslist here,
 * it returns function tests against it passed as an argument
 *
 * All the functions remain the same, except:
 * - `resolveUserAgent`, as it now uses UAParser instead of useragent
 * - `matchUA`, as it is rewritten towards isSupportedUA
 */
import semver from 'semver';
import UAParser from 'ua-parser-js';

// @see https://github.com/ai/browserslist#browsers

// map of equivalent browsers,
// see https://github.com/ai/browserslist/issues/156

const browserNameMap = {
  chrome: 'chrome',
  chromium: 'chrome',
  opera: 'opera',
  operamini: 'op_mini',
  operamobi: 'op_mob',
  operatablet: 'op_mob',
  baidu: 'baidu',
  bidubrowser: 'baidu',
  iemobile: 'ie_mob',
  ie: 'ie',
  edge: 'edge',
  ucbrowser: 'and_uc',
  chromewebview: 'chrome',
  androidbrowser: 'android',
  samsungbrowser: 'samsung',
  qqbrowserlite: 'and_qq',
  qqbrowser: 'and_qq',
  qq: 'and_qq',
  firefox: 'firefox',
  mozilla: 'firefox',
  firefoxfocus: 'firefox',
  mobilesafari: 'ios_saf',
  safari: 'safari',
};

// Convert version to a semver value.
// 2.5 -> 2.5.0; 1 -> 1.0.0;
const semverify = (version) => {
  if (typeof version === 'string' && semver.valid(version)) {
    return version;
  }

  const split = version.toString().split('.');

  while (split.length < 3) {
    split.push('0');
  }

  return split.join('.');
};

/**
 * Returns family and version of browser in compatible way for `browserslist`
 * e.g.: {family: "ie", version: "11.0.874.106"}
 */
function resolveUserAgent(uaString) {
  const { name, version } = (new UAParser(uaString)).getBrowser();
  const nameSlug = name.replace(/\s/g, '').toLocaleLowerCase();
  return {
    family: browserNameMap[nameSlug] || nameSlug,
    version: semverify(version.replace(/^(\d+.\d+.\d+)\..*/, '$1')),
  };
}

const parseBrowsersList = browsersList => browsersList.map((browser) => {
  const [browserName, browserVersion] = browser.split(' ');

  let normalizedName = browserName;
  let normalizedVersion = browserVersion;

  if (browserName in browserNameMap) {
    normalizedName = browserNameMap[browserName];
  }

  try {
    // Browser version can return as "10.0-10.2"
    const splitVersion = browserVersion.split('-')[0];
    normalizedVersion = semverify(splitVersion);
  } catch (e) {
    // do nothing
  }

  return {
    family: normalizedName,
    version: normalizedVersion,
  };
});


/**
 * matchUA is replaced by isSupportedUA
 * function takes uaString, and matches it against `process.env.SUPPORTED_BROWSERS`
 */
export const isSupportedUA = (uaString) => {
  /**
   * example for SUPPORTED_BROWSERS string:
   * and_chr 69|and_ff 62|and_qq 1.2|and_uc 11.8|android 67|baidu 7.12|chrome 70|chrome 69|chrome 68|\
   * edge 17|firefox 63|firefox 62|firefox 61|ie 11|ie_mob 11|ios_saf 12|ios_saf 11.3-11.4|ios_saf 11.0-11.2|\
   * op_mini all|op_mob 46|opera 56|safari 12|safari 11.1|samsung 7.2|
   */
  const browsers = process.env.SUPPORTED_BROWSERS.split('|');
  const parsedBrowsers = parseBrowsersList(browsers);
  const resolvedUserAgent = resolveUserAgent(uaString);

  /** compare browser name then browser version */
  return parsedBrowsers.some(browser => (
    browser.family.toLowerCase() === resolvedUserAgent.family &&
    semver.gte(resolvedUserAgent.version, browser.version)
  ));
};
