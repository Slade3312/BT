const fs = require('fs');
const path = require('path');
const request = require('request-promise');

const { composeLoggers } = require('../utils');
const { MAIN_SITE_URL } = require('../config');

module.exports = {
  fetchResource: async ({ url, query: qs, body, type, headers, method = 'GET' }, { req, res } = {}) => {
    const { showMessage, showError } = composeLoggers(req, res);
    const extendedQuery = type === 'model' ? { ...qs, _mode: 'react', _model: '' } : qs;

    const encodeGetParams = params => params && Object.keys(params).map((key) => {
      const value = extendedQuery[key];
      if (value === '') return encodeURIComponent(key);
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join('&') || '';

    const uri = `${MAIN_SITE_URL}${url}?${encodeGetParams(extendedQuery)}`;

    return request({ // eslint-disable-line
      uri,
      body,
      // formData: method === 'POST' ? { ...body } : null,
      resolveWithFullResponse: true,
      simple: type !== 'redirect',
      method,
      json: type === 'model' || type === 'json',
      headers,
      followRedirect: type !== 'redirect',
      encoding: null, // binary cases for, TO DO: add new format: binary
    }).then((crawlResponse) => {
      showMessage(
        ''.concat(
          method === 'POST' ? 'POST ' : '',
          url,
          qs && Object.keys(qs).length ? `\n  query: ${JSON.stringify(qs)}` : '',
          body ? `\n  body: ${JSON.stringify(body)}` : '',
          headers ? `\n  headers: ${JSON.stringify(headers)}` : '',
        ),
        'Crawling',
      );
      const responseBody = crawlResponse.body;
      const responseStatusCode = crawlResponse.statusCode;

      if (crawlResponse.statusCode >= 400) {
        showError(`Returned ${responseStatusCode}`, { browser: false });
        if (req) {
          /**
           * This condition will only fire if we request page directly
           * it will be ignored on crawler request
           */
          res.status(responseStatusCode).send(responseBody);
        }
        return false;
      }

      try {
        if (type === 'redirect') {
          if (responseStatusCode < 300 && responseStatusCode >= 400) {
            showError(`Expected 301 or 302, found ${responseStatusCode}`, { browser: false });
            if (req) {
              /**
               * This condition will only fire if we request page directly
               * it will be ignored on crawler request
               */
              res.send(responseBody);
            }
            return false;
          }

          return crawlResponse.headers.location.replace(/^(?:https?:)\/\/[^/]+/, '');
        } else if (type === 'htm') {
          return responseBody;
        }

        if (typeof responseBody !== 'object') {
          showError(`Expected JSON from crawled resource, found ${typeof responseBody}`);
          console.log(typeof responseBody === 'string' ? `${responseBody.substring(0, 200)}...` : responseBody);
          return false;
        }
        return responseBody;
      } catch (error) {
        showError(error.stack);
        return false;
      }
    }).catch((error) => {
      showError(error.stack);
      return false;
    });
  },

  addResource: async ({ slug, filePath }, { routeIndex }) => {
    const dirName = path.dirname(filePath);
    const listPath = path.resolve(dirName, `./__list${routeIndex || ''}.json`);

    let list;
    try {
      list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
    } catch (e) {
      list = [];
    }

    if (fs.existsSync(filePath) && list.indexOf(slug) === -1) {
      list.push(slug);
    }
    list.sort();
    fs.writeFileSync(listPath, JSON.stringify(list, null, 2), 'utf8');
  },

  writeResource: async ({ filePath, type, data }, { req, res } = {}) => {
    const { showMessage, showError } = composeLoggers(req, res);

    if (!filePath) {
      showError(`Incorrect filepath defined for crawler, name expected, found (${typeof filePath}) ${filePath}`);
      return false;
    }


    const dirName = path.dirname(filePath);
    /** create `./stubs` folder if it doesn't exist */
    if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);

    if (type === 'model' || type === 'json') {
      data = JSON.stringify(data, null, 2);
    }
    fs.writeFileSync(filePath, data);
    showMessage('Resource written successfully');
    return true;
  },
};
