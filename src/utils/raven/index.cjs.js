const jQuerySideEffects = window.$ && !window.$.ua;
const Raven = require('./index').default;
/** remove side effects caused by Raven */
if (jQuerySideEffects) delete window.$.ua;

module.exports = Raven;
