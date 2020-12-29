const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const userInfoDb = new JsonDB(new Config('server/db/user-info', true, true, '/'));

module.exports = { userInfoDb };
