const fs = require('fs');
const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const request = require('request-promise');
const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
// const formidableMiddleware = require('express-formidable');
// const connectSlashes = require('connect-slashes');

const { composeLoggers } = require('./utils');

const app = express();
app.use(cookieParser());
app.use(serveStatic('./'));
// app.use(formidableMiddleware());

/** Global error handler */
app.use((err, req, res, _) => { // eslint-disable-line no-unused-vars
  const { showError } = composeLoggers(req, res);
  showError(err.message, { browser: false });
  // If err has no specified error code, set error code to 'Internal Server Error (500)'
  if (!err.statusCode) err.statusCode = 500;
  // All HTTP requests must have a response, so let's send back an error with its status code and message
  res.status(err.statusCode).send(err.message);
});

/** crutch to kill process if node-dev failed */
const exitHandler = () => {
  console.log('\n\x1b[31mForce termination of watcher\x1b[0m');
  exec('lsof -n -i4TCP:8080 | grep -e ^node |awk \'{ print $2 }\' | xargs kill -9');
};
process.on('SIGINT', exitHandler); // catches ctrl+c event
process.on('uncaughtException', exitHandler); // catches uncaught exceptions


/** serve static straight from /build/ folder */
app.get([/^\/(?:css|js|assets)\/.*/, /.*\.(?:js|json|png|jpg|svg|gif)(?:\.map)?$/], [
  (req, res, next) => {
    express.static('./build')(req, res, next);
  },
  (req, res) => request(`http://localhost:8081${req.url}`)
    .on('response', response => response.pipe(res))
    .catch((err) => {
      const { showError } = composeLoggers(req, res);
      showError(err.message, { browser: false });
    }),
]);

// uncomment if trailing slashes required
// app.use(connectSlashes());

app.set('port', process.env.PORT || 8080);
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'pug');
// app.set('cache', false);
// app.set('etag', false);

// output pretty json
app.locals.pretty = true;

// require('./proxy')(app);
require('./routes')(app);


/**
 * As a SPA, all the other routes are rewritten index.htm
 */
/** serve static straight from /build/ folder */
app.get('*', [
  (req, res, next) => {
    if (fs.existsSync('./build/index.html')) {
      res.sendFile('index.html', { root: './build' });
      return;
    }
    next();
  },
  (req, res, next) => request('http://localhost:8081/index.html')
    .on('response', response => response.pipe(res))
    .catch((err) => {
      const { showError } = composeLoggers(req, res);
      showError(err.message, { browser: false });
      next();
    }),
]);


module.exports = app;
