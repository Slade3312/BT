/**
 * crawler uses the same index.routes.js file as the router,
 * documentation on setting up crawler is provided in `../server/routes.js`
 */


const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { composeRequestDecoder } = require('../utils');
const { fetchResource, writeResource } = require('./fetchResource');

/**
 * Require all of the .crawler files throughout the project
 * and download resources by crawler config
 */
glob.sync(path.resolve(__dirname, '../src/**/*.routes.js')).forEach((file) => {
  const dirName = path.dirname(file);

  const routes = require(file); // eslint-disable-line
  routes.forEach(async ({ url: requestUrl, condition, handler, Component, method, ...routeArgs }, routeIndex) => {
    const { type } = routeArgs;
    if (!Array.isArray(requestUrl)) requestUrl = [requestUrl];

    const listFilePath = path.resolve(dirName, `./stubs/__list${routeIndex || ''}.json`);
    if (fs.existsSync(listFilePath)) {
      const resources = JSON.parse(fs.readFileSync(listFilePath, 'utf8')); // eslint-disable-line
      /** run crawler for every resource object, providing proper baseDir */
      resources.forEach(async (slug) => {
        const decodeRequest = composeRequestDecoder({ slug, ...routeArgs, url: requestUrl, dirName });
        /** unpack request data */
        const { filePath, url, query, body, headers } = decodeRequest();
        const resourceData = await fetchResource({ url, filePath, query, body, headers, type, method });
        if (resourceData === false) return;
        writeResource({ type, filePath, data: resourceData });
      });
    }
  });
});
