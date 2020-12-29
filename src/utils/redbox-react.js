/**
 * Re-export for ReactRedbox, to remove it from production bundle
 */
module.exports = process.env.NODE_ENV === 'production' ? () => {} : require('redbox-react');
