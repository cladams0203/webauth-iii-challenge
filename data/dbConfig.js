const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig[process.env.FOOBAR || "development"]);

module.exports = db;
