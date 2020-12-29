/**
 * To use router, insert index.routes.js into your folder returning array of routes in following format:
 *
 * Common argument:
 * @param url - url to resource
 * @param *condition - takes request, the router will be applied if condition passes, otherwise - not
 *
 * Manual handled requests:
 *   to use manually handled requests, pass
 * @param handler - default router callback
 *
 * Example, returns text from agreementPopupText when key matches given, or just ignores route:
 * module.exports = [{
 *   url: '/shop/sitetext',
 *   handler: (req, res, next) => {
 *     if (req.query.key === 'SHOP_BASKET_SALES_AGREEMENT_POPUP') {
 *       res.sendFile(require.resolve('./stubs/agreementPopupText.htm'));
 *     } else {
 *       next();
 *     }
 *   },
 * }];
 * ---------------------------------------------------------
 *
 * Automatically handled requests with crawler:
 *   this mode activates if handler is not defined,
 *   it automatically crawls resource when appropriate stub doesn't exist
 *   encode requests into a filename to store result and decodes back
 *   when force crawling is used through npm run crawler
 * @param *type determines type of actions applied to route, if `model` given, it will read page model
 *   if htm is used, it will use '.htm' extension to keep file
 *   if proxy is used, all the methods, aka getQuery, getBody etc get `req` as first argument, instead of `slug`
 *
 * @param *Component - React root component, if omitted in `model` mode, the value in model.componentName will be used
 * @param getSlug: takes (req, res) as arguments, returns unique resource
 *   slug to be stored both in stabs and stabs/__list file
 * @param getUrl - takes slug, returns url for request, by default url param is used
 * @param getBody - takes slug, returns body object
 * @param getHeaders - takes slug, returns headers object
 * @param getQuery - takes slug, returns query object
 *
 * Example, same router as above, but with auto crawling:
 * module.exports = [{
 *   url: '/shop/sitetext/',
 *   condition: req => req.query.key === 'SHOP_BASKET_SALES_AGREEMENT_POPUP',
 *   getSlug: () => 'agreementPopupText',
 *   getQuery: () => ({ key: 'SHOP_BASKET_SALES_AGREEMENT_POPUP' }),
 *   type: 'htm',
 * }];
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const bodyParser = require('body-parser');
const proxy = require('http-proxy-middleware');
const multer = require('multer');
const render = require('./renderer');
const { userInfoDb } = require('./db/index');
const { composeLoggers, composeRequestDecoder } = require('./utils');
const { addResource, writeResource, fetchResource } = require('./crawler/fetchResource');
const { MAIN_SITE_URL } = require('./config');
const userInfoDefault = require('./routes/stubs/user-info.json');

const upload = multer();
/**
 * Require all of the .router files throughout the project
 * and add them to routing, with provided Component and data.
 * If data is unavailable, we download it and add to crawler config
 */

const AuthTokenCookieName = 'id_token';
const README_TOKEN = 'Set_Token_To_401_for_incorrect_user_403_for_blocked_user_or_404_for_unregistered_user';

module.exports = (app) => {
  glob.sync(path.resolve(__dirname, './routes/*.routes.js')).forEach((file) => {
    const routes = require(file); // eslint-disable-line
    const dirName = path.dirname(file);
    routes.forEach(({ url: requestUrl, condition, handler, Component, method, ...routeArgs }, routeIndex) => {
      const { type = 'json' } = routeArgs;
      /** if url is a string, we convert it to array for unification */
      if (!Array.isArray(requestUrl)) requestUrl = [requestUrl];

      if (type === 'proxy') {
        app.all(requestUrl, (req, res, next) => {
          const { showMessage } = composeLoggers(req, res);
          showMessage(req.url, '\nProxy');
          return proxy({ target: MAIN_SITE_URL, changeOrigin: true, logLevel: 'debug' })(req, res, next);
        });
        return;
      }

      app.post('/api/v1/phone_confirmation/', upload.none(), (req, res, next) => {
        if (req.body.phone && !req.body.code) {
          return res.status(200).json({
            message: 'success',
            time_left: 10,
          });
        } else if (req.body.phone && req.body.code) {
          userInfoDb.push('/', userInfoDefault);
          return res.cookie(AuthTokenCookieName, README_TOKEN).status(200).send();
        }
        return next();
      });

      app.all(
        requestUrl,
        bodyParser.json(),
        bodyParser.urlencoded({ extended: false }),
        (req, res, next) => {
          if (condition && !condition(req)) {
            next();
            return;
          }

          const { showMessage, showError } = composeLoggers(req, res);
          showMessage(req.url, '\nRequest');

          const decodeRequest = composeRequestDecoder({ ...routeArgs, url: requestUrl, dirName });
          /** fire custom handler if it exists */
          if (handler) {
            try {
              handler(req, res, next);
            } catch (error) {
              showError('Error executing custom handler');
              console.error(error);
            }
            return;
          }

          (async () => {
            let resourceData;
            try {
              /** unpack request data */
              const { slug, filePath, url, query, body, headers } = decodeRequest(req, res);
              /** otherwise process as crawlable resource */
              if (!fs.existsSync(path.resolve(filePath))) {
                /** if model json does not exist, crawl on the dev stand page and fetch it */
                resourceData = await fetchResource({ url, query, body, headers, type, method }, { req, res });
                if (resourceData === false) return;
                (async () => {
                  const isWrittenSuccessfully = await writeResource(
                    { filePath, type, data: resourceData },
                    { req, res },
                  );
                  if (isWrittenSuccessfully) {
                    addResource({ slug, filePath }, { routeIndex });
                  }
                })();
              } else {
                /** Finally read json model data */
                showMessage(filePath, 'Model');

                resourceData = fs.readFileSync(filePath, 'utf8');
                if (type === 'model' || type === 'json') {
                  resourceData = JSON.parse(resourceData);
                }
              }

              if (type === 'redirect') {
                res.redirect(resourceData);
                return;
              } else if (type === 'model') {
                /** parse resourceData as component json */
                const { componentName } = resourceData;
                const model = typeof componentName === 'undefined' ? resourceData : resourceData.model;

                /** if ?_model is passed, just output model data */
                if (typeof req.query._model !== 'undefined') {
                  if (model.header && model.footer && model.body) {
                    // only send body for page model
                    res.send({ ...model, header: '__REMOVED__', footer: '__REMOVED__' });
                  } else {
                    // otherwise just send model
                    res.send(model);
                  }
                  next();
                  return;
                }

                if (typeof Component !== 'undefined') {
                  /** render as react component using Component */
                  render(Component, model)(req, res);
                } else if (typeof componentName !== 'undefined') {
                  /** render as react component using fetched model componentName */
                  render(componentName.replace(/[^.]*/, ''), model)(req, res);
                } else {
                  /** just send model */
                  res.send(model);
                }
              } else if (type === 'json') {
                res.send(resourceData);
              } else { // htm
                /** just send file data */
                res.set(headers).send(resourceData);
              }
            } catch (error) {
              showError(`<div style="color: red"><pre>${error.stack}</pre></div>`);
            }
          })();
        },
      );
    });
  });
};
